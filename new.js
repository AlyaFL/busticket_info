var searchURL = 'https://api.klr.com.ua/api/info/get_cities?name=';
var search_city = 'https://al-trans.com.ua/api/v2/booking/search_trips';
const city_info_url ="https://al-trans.com.ua/api/v2/references/cities";


function func(){
    document.getElementById('form').addEventListener('submit', function(e) {
      e.preventDefault(); 
    })
    console.log("Hello");
}

const sendReq = (method, url, h) => {
    const headers = {
      'Content-Type': 'application/json',
      'authorization': 'Bearer ' + h,
    }
  
    return fetch(url, {
      method: method,
      // body: JSON.stringify(body),
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

function get_search_string(first_id, second_id, departure_date,cur) {
    let search_link = 'https://api.klr.com.ua/api/booking/search?from_city_id='+ first_id+ '&to_city_id='+ second_id+ '&departure_date='+departure_date+'&currency_id='+cur;
    return search_link;
}

const sendReq_o = (method, url, h, body=null) => {
  const headers = {
    'Content-Type': 'application/json',
    'odri-api-key':'vmuRLTyVnU+5KWbl9FPjqQ==',
    'Accept-Language':'uk',
    'Authorize': 'Bearer ' + h,
  }

  return fetch(url, {
    method: method,
    body:JSON.stringify(body),
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

function clean_detail(n){
  let count_routes = Object.values(n)[0];
    let new_var = "";
    if (count_routes > 9){
      count_routes = 9;
    }
    for (let i = 0; i < count_routes; i++) {
      new_var = "ul" + i
      const list = document.getElementById(new_var);
      while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
      }
    }
}

function clean_detail_odri(n){
  for (let i = 0; i < n; i++) {
  new_var = "ul" + i;
  const list = document.getElementById(new_var);
  while (list.hasChildNodes()) {
    list.removeChild(list.firstChild);
  }
}
}

function get_details(n){
  let count_routes = Object.values(n)[0];
  if (count_routes > 9){
    count_routes = 9;
  }
  console.log(count_routes);
  clean_detail(n);
  for (let i = 0; i < count_routes; i++) {
    let klr = Object.values(n.items)[i];
    let timetable = klr.timetable;
    let count_cities = Object.values(timetable).length;

    let som = "ul" + i;
    for (let j=0; j<count_cities; j++){
      let city_address =timetable[j].title +", " + timetable[j].address;
      let city_time = timetable[j].datetime + " ";
      let t_index = city_time.indexOf(":");
      city_time = city_time.slice(t_index-2,);
      const para = document.createElement("li");
      const para1 = document.createElement("strong");
      para.appendChild(para1);
      const node = document.createTextNode(city_time);
      para1.appendChild(node);
      
      const node1 = document.createTextNode(city_address);
      para.appendChild(node1);
      
      
      const element = document.getElementById(som);
      const child = document.getElementById("li");
      element.insertBefore(para, child);
      }
  }
}

function hide_info(){
  let som ='';
  let det = '';
  for (let i = 0; i < 9; i++){
    som = "show"+i;
    det = "detail"+i;
    document.getElementById(som).hidden=true;
    document.getElementById(det).hidden=true;
  }
}

function klr_get_data(n){
    hide_info();
    let count_routes = Object.values(n)[0];
    if (count_routes > 9){
      count_routes = 9;
    }
    console.log(count_routes);
    clean_detail(n);
    let shoe_string = "";
    for (let i = 0; i < count_routes; i++) {
      const klr = Object.values(n.items)[i];
      let discounts = klr.discounts;
      let price = klr.price.value;
      price = price.toString();
      let price_currency = klr.price.currency;
      let curr = '';
      let new_price = price;
      if (price_currency == "UAH"){
        curr = ' грн';
        let length1 = price.length;
        if (length1==4){
          new_price = price.slice(0,1)+"," + price.slice(-3);
        }
      }else if (price_currency == "EUR"){
        curr = ' EUR';
      }else if (price_currency == "PLN"){
        curr = ' PLN';
      }else if (price_currency == "CZK"){
        curr = ' CZK';
      }
      var id_show = "show"+i;
      let som = '';
      document.getElementById(id_show).hidden=false;
      som = "start_date"+i;
      document.getElementById(som).innerHTML = klr.start_date;
      som = "carrier_name"+i;
      document.getElementById(som).innerHTML = klr.carrier_name;
      som = "start_city_name"+i;
      document.getElementById(som).innerHTML = klr.start_city_name;
      som = "end_city_name"+i;
      document.getElementById(som).innerHTML = klr.end_city_name;
      som = "start_time"+i;
      document.getElementById(som).innerHTML = klr.start_time;
      som = "end_time"+i;
      document.getElementById(som).innerHTML = klr.end_time;
      som = "end_date"+i;
      document.getElementById(som).innerHTML = klr.end_date;
      som = "price"+i;
      
      document.getElementById(som).innerHTML = new_price+curr;
      som = "start_station"+i;
      document.getElementById(som).innerHTML = klr.start_station.name + ', ' +klr.start_station.address;
      som = "end_station"+i;
      document.getElementById(som).innerHTML = klr.end_station.name + ', ' +klr.end_station.address;
      som = "time_in_road"+i;
      document.getElementById(som).innerHTML = klr.time_in_road.days + ' д. ' + klr.time_in_road.hours + ' год. ' + klr.time_in_road.minutes + ' хв.';
    }
}

const find_klr = async (first_word, second_word, date_form, currency,t_k) => {
    
    let currency_id = '';
    if (currency == "UAH"){
      currency_id = 1;
    } else if (currency == "EUR"){
      currency_id = 2;
    } else if (currency == "PLN"){
      currency_id = 4;
    } else if (currency == "CZK"){
      currency_id = 8;
    }
    
    data = '';
  // Date from form
    let first_link = searchURL + first_word;
    let second_link = searchURL + second_word;
  // Get city id
    var new_request1 = await sendReq('GET', first_link, t_k);
    n = new_request1.data.response.cities;
    let first_id = Object.values(n)[0].id;
  var new_request2 = await sendReq('GET', second_link, t_k);
  n = new_request2.data.response.cities;
  let second_id = Object.values(n)[0].id;
  // Get trip info
  let new_link = get_search_string(first_id, second_id, date_form,currency_id)
  var search_request = await sendReq('GET', new_link, t_k);

  console.log(search_request);
  klr_get_data(search_request);
  get_details(search_request);
}

function show_info_odri(resp, curr){
  document.getElementById("show0").hidden=false;
  som = "start_date"+i;
  document.getElementById("start_date0").innerHTML = resp.departure_date;
  document.getElementById("carrier_name0").innerHTML = resp.carrier_name;
  document.getElementById("start_city_name0").innerHTML = resp.departure_city;
  document.getElementById("end_city_name0").innerHTML = resp.arrival_city;
  document.getElementById("start_time0").innerHTML = resp.departure_time;
  document.getElementById("end_time0").innerHTML = resp.arrival_time;
  document.getElementById("end_date0").innerHTML = resp.arrival_date;
  let price = resp.price;
  document.getElementById("price0").innerHTML = price.toString() + " " + curr;
  document.getElementById("start_station0").innerHTML = resp.departure_place;
  document.getElementById("end_station0").innerHTML = resp.arrival_place;
  document.getElementById("time_in_road0").innerHTML = resp.duration_dd + ' д. ' + resp.duration_hh + ' год. ' + resp.duration_mm + ' хв.';
}

const find_odri = async (first_word, second_word, date_form, currency,t_o) => {
  if (currency != "UAH" && currency !="EUR"){
    currency = "EUR";
  }
  var req = await sendReq_o('POST', city_info_url, t_o);
  city_array = req.cities;
  console.log(city_array);
  const count_routes = Object.values(req)[0].length;
  let first_link = '';
  let second_link = '';
  for (let i=0; i < count_routes; i++){
      if (city_array[i].name ==first_word){
          first_link = city_array[i].id;
      }
      if (city_array[i].name == second_word){
          second_link = city_array[i].id;
      }
  }
  clean_detail_odri(9);
  hide_info();
  console.log(first_link);
  console.log(second_link);
  let body= {"arrival_city_id":second_link,
  "departure_city_id":first_link,
  "depature_date":date_form,
  "search_with_cross":false,
  "back":false,
  "currecny_code":currency,
  "days_count_limit":1,
  "return_only_dates":false}
  var req = await sendReq_o('POST', search_city, t_o, body);
  response_odri = req.trips_sequences[0].trips[0];
  console.log(response_odri);
  show_info_odri(response_odri, currency);
  
}

function func() {
  const t_k = document.getElementById('tkt_k').innerHTML; 
  const t_o = document.getElementById('tkt_o').innerHTML;
    document.getElementById('form').addEventListener('submit', function(e) {
      e.preventDefault(); 
    })
    first_word = document.getElementById('from_city').value;
    second_word = document.getElementById('to_city').value;
    date_form = document.getElementById('date_form').value;
    currency = document.getElementById('currency').value;

    let cities_italy = ["Андрія", "Анкона", "Барі","Бергамо", "Болонья", "Брешія", "Венеція", "Местре", "Верона","Віченца", 
    "Казерта", "Капуа", "Кассіно", "Каянелло", "Комо", "Мілан", "Модена", "Неаполь", "Падуя", "Пезаро", "Пескара", 
    "Равенна", "Реджо-Емілія", "Рим", "Ріміні", "Ровіго", "Салерно", "Сан-Бенедетто-дель-Тронто", "Трані","Удіне",
     "Фаенца", "Феррара", "Флоренція", "Фоджа", "Чезена", "Черіньола", "Чивітанова-Марке", "Аліканте", "Альмерія", 
     "Барселона", "Бенідорм", "Валенсія", "Жирона", "Кастельон де ла Плана", 
     "Мадрид", "Малага", "Мурсія", "Севілія", "Таррагона", "Трієст", "Парма","П’яченца","Тортона","Генуя","Савона","Імперія"];

    if (cities_italy.includes(first_word) || cities_italy.includes(second_word)){
      find_odri(first_word, second_word, date_form, currency,t_o);     
      console.log('Odri');
    } else {
        find_klr(first_word, second_word, date_form, currency,t_k);
    }
   
}