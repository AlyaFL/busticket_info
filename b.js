const requestURL_o = 'https://al-trans.com.ua/api/v2/auth/signin';
const requestURL_k = 'https://api.klr.com.ua/api/login';
const get_city ="https://al-trans.com.ua/api/v2/references/cities";


const phr = document.getElementById("phrase").innerHTML;

function enc_dec(word){
    var decrypted = CryptoJS.AES.decrypt(word, phr);
    decrypted = decrypted.toString(CryptoJS.enc.Utf8);
    return decrypted;
}
let lk = document.getElementById("lk").innerHTML;
let pk = document.getElementById("pk").innerHTML;
let lo = document.getElementById("lo").innerHTML;
let po = document.getElementById("po").innerHTML;

const getToken_k = (method, url, body = null) => {
  const headers = {
    'Content-Type': 'application/json',
  }

  return fetch(url, {
    method: method,
    body: JSON.stringify(body),
    headers: headers
  })
  .then(response => {
    if (response.ok) {
      return response.json()
    }

    return response.json()
    .then(error => {
      const e = new Error('Что-то пошло не так')
      e.data = error
      throw e
    })
  })
}

const getToken_o = (method, url, body = null) => {
    const headers = {
      'Content-Type': 'application/json',
      'odri-api-key':'vmuRLTyVnU+5KWbl9FPjqQ==',
      'Accept-Language':'uk'
    }
  
    return fetch(url, {
      method: method,
      body: JSON.stringify(body),
      headers: headers
    })
    .then(response => {
      if (response.ok) {
        return response.json()
      }
  
      return response.json()
      .then(error => {
        const e = new Error('Что-то пошло не так')
        e.data = error
        throw e
      })
    })
  }


const body_k= {
    "email": enc_dec(lk),
    "password": enc_dec(pk)
}

const body_o= {
    "email": enc_dec(lo),
    "password": enc_dec(po)
  }

const main = async () =>{
  // Token
  var a = await getToken_o('POST', requestURL_o, body_o);
  let token_o = a.access_token;

  document.getElementById("tkt_o").innerHTML = token_o;

  var a = await getToken_k('POST', requestURL_k, body_k);
  let token_k = a.access_token;

  document.getElementById("tkt_k").innerHTML = token_k;

}

