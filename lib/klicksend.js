const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

const translate = {
    'AC_BOLETOU': 'pluewOa',
    'AC_COMPROU': 'kRuO15M',
    'AC_CANCELADA': 'd3uPdWr',
    'AC_EXPIROU': 'aaum0pX',
    'AC_REEMBOLSADA': 'MouQvp6',
    'AC_EM_RECUPERACAO': '5du2mO3',
}

getParams = (lead) => {
    const params = new URLSearchParams();

    params.append('email', lead.email);

    if (lead.name) {
        const name = lead.name.split(" ")
        params.append('first_name', name[0]);
        if (name.length > 0)
            params.append('first_name', name[0]);
        if (name.length > 1)
            params.append('last_name', name.slice(1).join(" "));
    }

    if (lead.phone)
        params.append('phone', lead.phone);

    return params;
}

subscribe = async (lead, tag) => {

    const params = getParams(lead)
    params.append('b_' + tag, '');

    return await fetch('https://handler.klicksend.com.br/subscription/' + tag, { method: 'POST', body: params })
        .then(res => {
            if (!res.ok) throw res;
            return res.url;
        })
        .catch(err => { throw err });
}

module.exports = async(lead) => {
    console.log(lead)
    return  await subscribe(lead, translate[lead.tag])
}
