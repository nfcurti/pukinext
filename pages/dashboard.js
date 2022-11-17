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

  const [buffer, setBuffer] = useState([]);

  useEffect(() => {
    loadGraphic();
    return;
  }, []);

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
                  _array.push({
                    uuid: _parts[i],
                    date: _parts[i+1],
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

  const button = document.getElementById('connect')

  var serviceUUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b'
  
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
               navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
                  optionalServices: [ serviceUUID ]
            })
            .then(device => {
              bluetoothDevice = device;
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
        }); 

  const loadGraphic = () => {
    const ctx = document.getElementById('myChart').getContext('2d');

          var url = "https://script.googleusercontent.com/macros/echo?user_content_key=RoTvzw3Jrao6Q5ozTMIClzKXal_nVgNXmB4kdqmZOEbWaSh5vLZ_cGCjk-51WUCeqL82qkNYb1OYcUjn-XsCKao5x-nZc5NIm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnEDSMxuy4oxGke5DwX9rX_d17KxU0ERkB0tMVJS4KW41AajhB3o1aK8_k9BaIGcvdREHoH3TmIf2RgiyHkInq-HVoVs1IT-z7A&lib=MqcSznd5SPDxLVg4nodiELbfU9wjpaBD5"
          

          httpGetAsync(url, function(excelResult) {
              console.log(excelResult)

              getPukiDataFromExcel(excelResult, function(pukiData) {
                console.log(pukiData)
                setTotalFootsteps(pukiData.length)
              })
          });
          
          function average(ctx) {
            const values = ctx.chart.data.datasets[0].data;
            return values.reduce((a, b) => a + b, 0) / values.length;
          }
          setTimeout(function () {
              const myChart = new Chart(ctx, {
              type: 'line',
              data: {
                  labels: ['1/10/2022', '2/10/2022', '3/10/2022', '4/10/2022', '5/10/2022', '6/10/2022'],
                  datasets: [{
                      label: '# of steps',
                      data: [12, 19, 13, 15, 21, 13],
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
