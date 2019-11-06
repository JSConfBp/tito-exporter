

export default (data, eventConfig) => {

    const { tickets } = eventConfig

    return data.map(order => {

        const catering = Object.values(order.quantities).map(ticket => {
            
            const selectedTicket = Object.keys(tickets).find( t => ticket.release.includes(t))

            if (!selectedTicket) return 'N/A'
        
            return tickets[selectedTicket].catering_NET
        })
        
        return Object.assign({}, order, { catering })
    })
}