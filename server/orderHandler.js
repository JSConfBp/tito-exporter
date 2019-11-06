const fetch = require('isomorphic-unfetch')


const events = {
	'jsconf-budapest-2019': 'jsconf-bp/jsconf-budapest-2019',
	'reinforce-conf-2019': 'reinforceconf/reinforce2019',
	'jsconf-budapest-2020': 'jsconf-bp/jsconf-budapest-2020',
}

const getOrders = async (req, res) => {
	const { event } = req.query;

	console.log('getOrders', event);

	if (!event) throw Error('Missing event')

	const getUrl = (page) => `https://api.tito.io/v3/${events[event]}/registrations?view=extended&page=${page}`;
	const getPage = async function* getPage() {
		let page = 1
		let hasNextPage = true

		while (hasNextPage) {
			console.log('fetching ', getUrl(page));

			const response = await fetch(
				getUrl(page),
				{
					headers: {
						Authorization: `Token token=${process.env.TITO_JSCONF_API_TOKEN}`,
						Accept: 'application/json',
					}
				}
			);

			const data = await response.json();

			if (data.meta.next_page) {
				page = data.meta.next_page
				yield {
					last: false,
					meta: data.meta,
					data: data.registrations,
				}
			} else {
				hasNextPage = false
				yield {
					last: true,
					meta: data.meta,
					data: data.registrations
				};
			}
		}

		return;
	}

	try {
		let hasMeta = false
		res.setHeader('Content-Type', 'application/json; charset=utf-8');
		res.setHeader('Transfer-Encoding', 'chunked');

		for await (const item of getPage()) {
			if (!hasMeta && item.meta) {
				res.setHeader('x-item-count', item.meta.total_count);
				res.write('[')
			}
			hasMeta = true

			res.write(
				JSON.stringify(item.data).substr(1).replace(/]$/, '') + (item.last ? '' : ',')
			)
		}
		res.write(']')
		res.end()
	} catch(e) {
		console.log(e);
		res.end()
		return ''
	}
}

module.exports.get = async (req, res) => {
	// if (
	// 	process.env.ADMIN_TOKEN
	// 	&& process.env.ADMIN_TOKEN !== req.headers.token
	// ) {
	// 	res.status(401).send()
	// 	return;
	// }

	try {
		const orders = await getOrders(req, res)
		res.send(orders)
	} catch (e) {
		res.sendStatus(403)
	}
}
