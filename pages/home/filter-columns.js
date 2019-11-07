

import { getCateringPerTicket } from './calculate-catering'
import numeral from 'numeral'

const getTickets = (quantities) => {
	return Object.values(quantities).map(ticket => {
		const { release, quantity } = ticket
		return `${quantity} x ${release}`
	}).join("\n")
}

const getBillingAddress = (billing_address) => {
	const {
		address,
		city,
		country,
		vat_number,
	} = billing_address;

	return {
		"Billing Address": address,
		City: city,
		Country: country,
		"VAT Number": vat_number,
	}
}

const getItemizedCosts = (tickets, eventConfig) => {
	return tickets.map((ticket, i) => {
		const price = parseFloat(ticket.price)

		const netCatering = getCateringPerTicket(ticket.release_title, eventConfig)
		const netTicket = (price / 1.27) - netCatering;

		const grossTicket = netTicket * 1.27
		const grossCatering = netCatering * 1.27
		
		const netTotal = netTicket + netCatering
		const taxTotal = (netTicket * 0.27) + (netCatering * 0.27)

		numeral.defaultFormat('0,0.00')
		
		return {
			netTicket: numeral(netTicket).format(),
			grossTicket: numeral(grossTicket).format(),
			netCatering: numeral(netCatering).format(),
			grossCatering: numeral(grossCatering).format(),
			netTotal: numeral(netTotal).format(),
			taxTotal: numeral(taxTotal).format(),
		}
	})

}

export default (data, eventConfig) => data.map(row => {
	if (row) {
		const {
			created_at,
			name,
			email,
			phone_number,
			company_name,
			billing_address,
			quantities,
			catering,
			tickets,
			reference,
			total,
			payment_option_provider_name,
			payment_reference,
		} = row

		const billingData = billing_address ? getBillingAddress(billing_address) : '';
		const Tickets = getTickets(quantities);
		const costs = getItemizedCosts(tickets, eventConfig);

		const getCostField = (field) => costs.map( cost => cost[field]).join("\n")
		console.log(costs);
		
		const columns = {
			Created: created_at,
			Name: name || '',
			Email: email || '',
			"Phone Number": phone_number || '',
			"Company Name": company_name || '',
			...billingData,
			Tickets,
			"Tito Reference": reference,
			"NET Ticket": getCostField('netTicket'),
			"GROSS Ticket": getCostField('grossTicket'),
			"NET Catering": getCostField('netCatering'),
			"GROSS Catering": getCostField('grossCatering'),
			"NET Total": getCostField('netTotal'),
			"Tax": getCostField('taxTotal'),
			Total: total || '',
			"Payment Provider": payment_option_provider_name || '',
			"Payment Reference": payment_reference || '',
		}

		return columns
	}
})