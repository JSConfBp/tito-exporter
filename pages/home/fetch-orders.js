import fetch from 'isomorphic-unfetch'

const getProgress = (total, current) => (total - current)

export default async (setCompleted, onReady) => {
	try {
	  const req = await fetch('/api/orders')
	  const body = req.body

	  const total = parseInt(req.headers.get('x-item-count'), 10);
	  let remaining = total;

	  const reader = await body.getReader();
	  const stream = await new ReadableStream({
		start(controller) {
			return pump();

			function pump() {
			  return reader
				.read()
				.then(({ done, value }) => {
				  if (value) {
					const entries = new TextDecoder("utf-8").decode(value).match(/"registration"/gi)
					const count = entries ? entries.length : 0;
					remaining = getProgress(remaining, count)
					setCompleted(100 - Math.floor((remaining / total) * 100))
					controller.enqueue(value);
				  }

				  // When no more data needs to be consumed, close the stream
				  if (done) {
					  controller.close();
					  return;
				  }
				  // Enqueue the next data chunk into our target stream
				  return pump();
				})
				.catch( e => { console.error(e)});
			}
		}
	  })
	  const resp = await new Response(stream)
	  const data = await resp.json()
	  data.pop() // remove last dud
	  onReady(data)
	} catch (e) {
	  console.error(e);
	}
  }