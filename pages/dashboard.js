import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Script from 'next/script'
import React, { useState, useEffect } from 'react';
import Link from 'next/link'

export default function Home() {
  const [sessionFootsteps, setSessionFootsteps] = useState(0);
  const [totalFootsteps, setTotalFootsteps] = useState(0);
  const [average, setAverage] = useState(0);
  const [sessionUptime, setSessionUptime] = useState(0);
  const [connectStatus, setConnectStatus] = useState("Connect");
  const [filterStatus, setFilterStatus] = useState(false);
  const [filteredUuids, setFilteredUuids] = useState([]);
  const [filterInput, setFilterInput] = useState('');

  const [buffer, setBuffer] = useState([]);
  var bluetoothDevice
  var serviceUUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b'
  
  useEffect(() => {
    
    loadGraphic();
    return;
  }, []);

  useEffect(()=>{
    loadBLEInterface();
  })

  const httpGetAsync = (theUrl, callback) => {
              var xmlHttp = new XMLHttpRequest();
              xmlHttp.onreadystatechange = function() { 
                  if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                      callback(xmlHttp.responseText);
              }
              xmlHttp.open("GET", theUrl, true);  
              xmlHttp.send(null);
          }

  const getPukiDataFromExcel = (raw, callback) => {
          let _parts = raw.split(',').slice(3, raw.length);
              if((_parts.length) %3 == 0) {
                var _array = []
                for(var i=0 ; i < _parts.length;i=i+3) {
                  var _date = new Date(_parts[i+1])
                  
                  _array.push({
                    uuid: _parts[i],
                    date: _date,
                    action: _parts[i+2]
                  })
                }
                return callback(_array);
              }else{
                //Error, los resultados no son multiplos de 4. paso algo
              }
        }      


  const handleCharacteristicValueChanged = (event)  => {
              var value = JSON.stringify(event.target.value);
              console.log(buffer);

              var time = new Date();
              const  timestamp = ''+time.getUTCHours()+time.getUTCMinutes()+time.getUTCSeconds()




              if (!buffer.includes(timestamp)) {
                console.log(buffer)
                 var url = "https://script.google.com/macros/s/AKfycbxCpCi08Og8DPEf3QDuRQWX78xeqiM4JCsuEwycIDdkx-5t1vXb966Qy6aXcBArB6_m/exec?uuid="+serviceUUID+"&date="+time+"&action=step"
                  fetch(url, {mode:"no-cors"}).then(function(response) {
                  }).then(function(data) {
                  }).catch(function(e) {
                    console.log(e);
                  });
                  var _tempBuffer = buffer
                  _tempBuffer.push(timestamp);
                  setBuffer(_tempBuffer);
              }
          }


  const loadBLEInterface = () =>{
  
    const button = document.getElementById('connect')
  
    function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
              }
  
    function handleNotifications(event) {
              let value = event.target.value;
              let a = [];
  
              for (let i = 0; i < value.byteLength; i++) {
                a.push('0x' + ('00' + value.getUint8(i).toString(16)).slice(-2));
              }
              log('> ' + a.join(' '));
            }
  
    button.addEventListener('pointerup', function(event) {
              if (connectStatus === "Disconnect") {
                console.log(bluetoothDevice)
                bluetoothDevice.gatt.disconnect();
                setConnectStatus("Connect")
              } else {
                              navigator.bluetooth.requestDevice({
                  acceptAllDevices: true,
                    optionalServices: [ serviceUUID ]
              })
              .then(device => {
                bluetoothDevice = device
                return device.gatt.connect();
              })
              .then(server => {
                return server.getPrimaryService(serviceUUID);
              })
              .then(service => {
                return service.getCharacteristic('beb5483e-36e1-4688-b7f5-ea07361b26a8');
              })
              .then(characteristic => characteristic.startNotifications())
              .then(characteristic => {
                characteristic.addEventListener('characteristicvaluechanged',
                                                handleCharacteristicValueChanged);
                console.log('Notifications have been started.');
                setConnectStatus("Disconnect")
              })
              .catch(error => { console.log(error); });
              }

          }); }

  const getLastThirtyDays = () => {
    const _today = new Date();
    var _newArray = [];
    for(var i=0;i<31;i++) {
      var _tempDate = new Date();
      _tempDate.setDate(_tempDate.getDate() - i);
      _newArray.push(_tempDate)
    }
    return _newArray;
    
  }

  const getLastThirtyDaysAsString = () => {
    var array = getLastThirtyDays();
    var _newArray = [];
    for(var i=0;i<array.length;i++) {
      var _date = new Date(array[i])
      var _day = _date.getDate();
      var _month = _date.getMonth()+1
      var _year = _date.getFullYear()
      _newArray.push(_day+'/'+_month+'/'+_year)
    }
    return _newArray.reverse()
  }

  const loadGraphic = (withFilter) => {
    const ctx = document.getElementById('myChart').getContext('2d');
    
    
          var url = "https://script.googleusercontent.com/macros/echo?user_content_key=RoTvzw3Jrao6Q5ozTMIClzKXal_nVgNXmB4kdqmZOEbWaSh5vLZ_cGCjk-51WUCeqL82qkNYb1OYcUjn-XsCKao5x-nZc5NIm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnEDSMxuy4oxGke5DwX9rX_d17KxU0ERkB0tMVJS4KW41AajhB3o1aK8_k9BaIGcvdREHoH3TmIf2RgiyHkInq-HVoVs1IT-z7A&lib=MqcSznd5SPDxLVg4nodiELbfU9wjpaBD5"
          

          httpGetAsync(url, function(excelResult) {
              console.log(excelResult)

              getPukiDataFromExcel(excelResult, function(pukiData) {
                // console.log(pukiData)
                if(withFilter != null) {
                  var _stepsFiltered = pukiData.filter(u => u.uuid == withFilter)

                  setTotalFootsteps(_stepsFiltered.length)
                }else{
                  setTotalFootsteps(pukiData.length)
                }
                

                var _graphicDataArray = [];
                var _last30Days = getLastThirtyDays();

                var uniqueIds = []

                for(var y=0;y<pukiData.length;y++) {
                  if(uniqueIds.indexOf(pukiData[y].uuid) == -1) {
                    uniqueIds.push(pukiData[y].uuid.toString())
                  }
                }
                setFilteredUuids(uniqueIds);

                
                for(var i=0;i<_last30Days.length;i++) {
                  
                  if(withFilter != null) {
                    var _existDate = pukiData.filter(a => a.uuid == withFilter && a.date.getDate() == _last30Days[i].getDate() &&
                    a.date.getMonth() == _last30Days[i].getMonth() &&  a.date.getFullYear() == _last30Days[i].getFullYear()  );
                  // console.log(_existDate)
                    _graphicDataArray.push(_existDate.length)
                  }else{
                    var _existDate = pukiData.filter(a => a.date.getDate() == _last30Days[i].getDate() &&
                    a.date.getMonth() == _last30Days[i].getMonth() &&  a.date.getFullYear() == _last30Days[i].getFullYear()  );
                  // console.log(_existDate)
                    _graphicDataArray.push(_existDate.length)
                  }
                  
                  
                }


                console.log(uniqueIds)
                _graphicDataArray = _graphicDataArray.reverse()

                var _lastDays = getLastThirtyDaysAsString();

                var _posToRemovePreZeros = -1;
                var _counterPTRRZ = 0;
                while(_posToRemovePreZeros == -1) {
                  if(_graphicDataArray[_counterPTRRZ] == 0){
                    _counterPTRRZ = _counterPTRRZ + 1;
                  }else{
                    _posToRemovePreZeros = _counterPTRRZ;
                  }
                }
                _graphicDataArray = _graphicDataArray.slice(_posToRemovePreZeros, _graphicDataArray.length);
                _lastDays = _lastDays.slice(_posToRemovePreZeros, _lastDays.length);

                
                // if(withFilter != null) {
                //   var _tempArray = []
                //   var _tempDays = []
                //   for(var k=0;k<_graphicDataArray.length;k++) {
                //     console.log('Is '+_graphicDataArray[k].uuid+' equals to '+withFilter+'?')
                //     console.log(_graphicDataArray[k])
                //     if(_graphicDataArray[k].uuid == withFilter) {
                //       _tempArray.push(_graphicDataArray[k]);
                //       _tempDays.push(_lastDays[k]);
                //     }
                //   }
                //   _graphicDataArray = _tempArray;
                //   _lastDays = _tempDays
                // }

                function average(ctx) {
                  const values = ctx.chart.data.datasets[0].data;
                  return values.reduce((a, b) => a + b, 0) / values.length;
                }
                setTimeout(function () {
                  
                  let chartStatus = Chart.getChart("myChart"); // <canvas> id
                  if (chartStatus != undefined) {
                    chartStatus.destroy();
                          //(or)
                   // chartStatus.clear();
                  }
                    const myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: _lastDays,
                        datasets: [{
                            label: '# of steps',
                            data: _graphicDataArray,
                            backgroundColor: [
                                'rgba(15,51,255,0.5)'
                            ],
                            borderColor: [
                                'rgba(15,51,255,1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                      
                        scales: {
                          x: {
                                beginAtZero: true,
                                grid: {
                                  color: 'rgba(255,255,255,0.1)'
                                }
      
                            },
                            y: {
                                beginAtZero: true,
                                grid: {
                                  color: 'rgba(255,255,255,0.1)'
                                }
      
                            }
                        }
                    },
                    plugins: {
                      
                      annotation: {
                        annotations: {
                          type: 'line',
                          borderColor: 'white',
                          borderDash: [6, 6],
                          borderDashOffset: 0,
                          borderWidth: 3,
                          label: {
                            enabled: true,
                            content: (ctx) => 'Average: ' + average(ctx).toFixed(2),
                            position: 'end'
                          },
                          scaleID: 'y',
                          value: (ctx) => average(ctx)
      
                                }
                      }
                    }
                });
                }, 500);
              })
          });
          
          
  }

  

  return (
    <div className={styles.container}>
      <Head>
        <title>Puki Technologies</title>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <meta name="description" content="HTML5 website template"/>
        <meta name="keywords" content="global, template, html, sass, jquery"/>
        <meta name="author" content="nfc"/>
        <link rel="icon" type="image/svg" href="/img/logo.svg"/>
      </Head>
      <div className="perspective effect-rotate-left">
        <div className="container"><div className="outer-nav--return"></div>
          <div id="viewport" className="l-viewport" style={{overflow: 'scroll'}}>
            <div className="l-wrapper">
              <header className="header">
                <a className="header--logo" href="/">
                  <img src="/img/logo.svg" alt="logo" width="50"/>
                  <h2 style={{marginLeft: '3em'}}>Your Dashboard</h2>
                </a>
                <button className="header--cta cta"><a href='https://twitter.com/pukitechs'>Contact Us</a></button>
                <div className="header--nav-toggle">
                  <span></span>
                </div>
              </header>
              <nav className="l-side-nav" style={{display: 'none'}}>
                <ul className="side-nav">
                  <li href="/"><span><a >Home</a></span></li>
                  <li><span>How</span></li>
                  <li><span>Team</span></li>
                  <li><span>Contact</span></li>
                  <li className="is-active"><span><a href="/dashboard">Dashboard</a></span></li>
                </ul>
              </nav>
              <ul className="l-main-content main-content">
                <li className="l-section section section--is-active">
                  <div className="intro">
                    <div className="intro--banner" style={{position: 'initial'}}>

                      <button id="connect" className="cta">{connectStatus}
                        <span className="btn-background"></span>
                      </button>
                      <button onClick={() => setFilterStatus(!filterStatus)} className="cta">Filter
                        <span className="btn-background"></span>
                      </button>
                      {
                        // filterStatus ? <div>
                        // {
                        //   filteredUuids.map(item => <div key={filteredUuids.indexOf(item)} onClick={() => {
                        //     loadGraphic(item);
                        //   }}>
                        //       <a href='#'>{item}</a>
                        //   </div>)
                        // }
      
                        // <div onClick={() => {
                        //   loadGraphic();
                        // }}>
                        //   <a href='#'>Remove all filters</a>
                        // </div>
                      filterStatus ? <div>
                        <input type='text' value={filterInput} onChange={(ev) => setFilterInput(ev.target.value)}/><button onClick={() => {
                          if(filterInput == '') {
                            loadGraphic();
                          }else{
                            loadGraphic(filterInput);
                          }
                          
                        }}>Search</button>
                      </div> : <div/>
                      }
                      <div className="footstepsData">
                        <div>Footsteps (Session)
                          <p>{sessionFootsteps} 
                            <span> steps</span></p>
                        </div>
                        <div>Footsteps (Total)
                          <p>{totalFootsteps}  
                            <span> steps</span></p>
                        </div>
                        <div>Average
                          <p>{average}  
                            <span> steps/d</span></p>
                        </div>
                        <div>Uptime
                          <p>{sessionUptime}  
                            <span> days</span></p>
                        </div>
                      </div>
                      <br/>
                      <div>
                        <canvas id="myChart" width="800" height="300"></canvas>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
          <ul className="outer-nav">
            <li ><a href="/">Home</a></li>
            <li>How</li>
            <li>Team</li>
            <li>Contact</li>
            <li className="is-active"><a href="/dashboard">Dashboard</a></li>
          </ul>
      </div>

      <Script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></Script>
      <Script src="/js/functions-min.js"></Script>
      <Script src="https://cdn.jsdelivr.net/npm/chart.js"></Script>

    </div>
  )
}
