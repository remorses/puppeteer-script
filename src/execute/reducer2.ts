


export default (settings) => async (state, action) => {
    const { page, data } = await state
    if (action.method === 'test') {
        console.log(`working!!!!, settings are ${settings}`)
        return { page, data }
    } else {
        return {page, data }
    }

}
