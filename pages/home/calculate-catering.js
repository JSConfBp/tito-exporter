
export const getCateringPerTicket = (ticketName, eventConfig) => {
    const { tickets } = eventConfig
    const selectedTicket = Object.keys(tickets).find( t => ticketName.includes(t))

    if (!selectedTicket) return 'N/A'
        
    return tickets[selectedTicket].catering_NET
}


export default (data, eventConfig) => {
    return data.map(order => {

        const catering = Object.values(order.quantities).map(ticket => getCateringPerTicket(ticket.release, eventConfig))
        
        return Object.assign({}, order, { catering })
    })
}