

const getTickets = (quantities) => {
	return Object.values(quantities).map(ticket => {
		const { release, quantity } = ticket
		return `${quantity} x ${release}`
	}).join(", ")

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

export default (data) => data.map(row => {
	if (row) {
		const {
			created_at,
			name,
			email,
			phone_number,
			company_name,
			billing_address,
			quantities,
			reference,
			total,
			payment_option_provider_name,
			payment_reference,
		} = row

		const billingData = billing_address ? getBillingAddress(billing_address) : '';
		const tickets = getTickets(quantities);

		const columns = {
			Created: created_at,
			Name: name || '',
			Email: email || '',
			"Phone Number": phone_number || '',
			"Company Name": company_name || '',
			...billingData,
			Tickets: tickets,
			Reference: reference,
			Total: total || '',
			"Payment Provider": payment_option_provider_name || '',
			"Payment Reference": payment_reference || '',
		}

		return columns
	}
})