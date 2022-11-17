import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Script from 'next/script'
import Link from 'next/link'

export default function Home() {
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

      <div className="device-notification">
        <a className="device-notification--logo" href="/">
          <img src="/img/logo.svg" alt="Global"/>
        </a>
        <p className="device-notification--message">Puki has so much to offer that we must request you orient your device to portrait or find a larger screen. You won't be disappointed.</p>
      </div>
      <>
        <div className="perspective effect-rotate-left">
          <div className="container"><div className="outer-nav--return"></div>
            <div id="viewport" className="l-viewport">
              <div className="l-wrapper">
                <header className="header">
                  <a className="header--logo" href="/">
                    <img src="/img/logo.svg" alt="logo" width="50"/>
                    <h2 style={{marginLeft: '3em'}}>Puki Technologies</h2>
                  </a>
                  <button className="header--cta cta"><a href='https://twitter.com/pukitechs'>Contact Us</a></button>
                  <div className="header--nav-toggle">
                    <span></span>
                  </div>
                </header>
                <nav className="l-side-nav">
                  <ul className="side-nav">
                    <li className="is-active"><span>Home</span></li>
                    <li><span>How</span></li>
                    <li><span>Team</span></li>
                    <li><span>Contact</span></li>
                  </ul>
                </nav>
                <ul className="l-main-content main-content">
                  <li className="l-section section section--is-active">
                    <div className="intro">
                      <div className="intro--banner">
                        <h1 className="megatitle" >Puki: in-store analytics from smart tiles</h1>
                        
                        <h1 style={{fontSize: '1em',fontWeight: '600',marginBottom: '3em'}}>Enhance your in-store experience, identify new oportunities and boost your sales by tracking your customer habits. </h1>
                        
                        <button  className="cta"><a href="/dashboard">Dashboard</a>
                          <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 150 118"  xmlSpace="preserve">
                          <g transform="translate(0.000000,118.000000) scale(0.100000,-0.100000)">
                            <path d="M870,1167c-34-17-55-57-46-90c3-15,81-100,194-211l187-185l-565-1c-431,0-571-3-590-13c-55-28-64-94-18-137c21-20,33-20,597-20h575l-192-193C800,103,794,94,849,39c20-20,39-29,61-29c28,0,63,30,298,262c147,144,272,271,279,282c30,51,23,60-219,304C947,1180,926,1196,870,1167z"/>
                          </g>
                          </svg>
                          <span className="btn-background"></span>
                        </button>
                        <img src="/img/introduction-visual.png" alt="Welcome" style={{display: 'none'}} />
                      </div>
                      <div className="intro--options">

                        <a style={{cursor: 'default'}}>
                          <h3>Clean Energy</h3>
                          <p>Puki floors are self-sustainable. The tile produces enough energy on footfall to power and charge itself.</p>
                        </a>
                        <a  style={{cursor: 'default'}}>
                          <h3>Easy to install</h3>
                          <p>Manage every tile from your personal dashboard!</p></a>
                        <a style={{cursor: 'default'}}>
                          <h3>Privacy First</h3>
                          <p>All data is stored anonymously and encrypted to ensure compliance with GDPR and CCPA.</p></a>
                      </div>
                    </div>
                  </li>
                  <li className="l-section section">
                    <div className="work" style={{marginTop: '-10%'}}>
                      <h2 style={{marginBottom: '5em',marginTop: '5em'}}>How it works</h2>
                      <div className="work--lockup row" style={{display: 'block',margin: '0 auto',marginBottom: '5em'}}>
                          <img onMouseOver={()=>document.getElementById('content').innerHTML = 'On every motion such as a footfall, you produce mechanical energy'} src="/img/ff.svg" alt="ff" width="40"/>
                          <img  src="/img/back.svg" alt="battery" width="20" style={{marginBottom: '1.2em',marginLeft: '2em'}}/>
                          <img onMouseOver={()=>document.getElementById('content').innerHTML = 'Footfall energy gets transformed into electricity through energy harvesting'} src="/img/recycle.svg" alt="battery" width="50" style={{marginLeft:'2em'}}/>
                          <img  src="/img/back.svg" alt="battery" width="20" style={{marginBottom: '1.2em',marginLeft: '2em'}}/>
                          <img onMouseOver={()=>document.getElementById('content').innerHTML = 'Energy gets directly stored on small batteries'}  src="/img/battery.svg" alt="battery" width="50" style={{marginLeft:'2em'}}/>
                          <img  src="/img/back.svg" alt="battery" width="20" style={{marginBottom: '1.2em',marginLeft: '2em'}}/>
                          <img onMouseOver={()=>document.getElementById('content').innerHTML = 'A small portion is used to send the specific footfall data to your dashboard'}  src="/img/energy.svg" alt="battery" width="50" style={{marginLeft:'2em'}}/>
                      </div>
                      <h2 id="content" style={{display: 'block',margin: '0 auto',fontSize: '1.3em'}}>Hover on icon to learn more!</h2>
                    </div>
                  </li>
                  <li className="l-section section">
                    <div className="about">
                      <div className="about--banner">
                        <h2>We<br/>believe in<br/>passionate<br/>people</h2>
                        
                        <img src="/img/about-visual.png" alt="About Us" style={{display: 'none'}}/>
                      </div>
                      <div className="about--options">
                        <a href="https://www.linkedin.com/in/ncurti/" style={{backgroundImage: 'url(/img/3.jpg)'}}>
                          <h3>CEO - Founder</h3>
                        </a>
                      </div>
                    </div>
                  </li>
                  <li className="l-section section">
                    <div className="contact">
                      <div className="contact--lockup">
                        <div className="modal">
                          <div className="modal--information">
                            <p>Milan, Italy</p>
                            <a href="mailto:ouremail@gmail.com">info@pukitechnologies.com</a>
                            <a href="tel:+393495479701">Call Us</a>
                          </div>
                          
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="l-section section">
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <ul className="outer-nav">
            <li className="is-active">Home</li>
            <li>How</li>
            <li>Team</li>
            <li>Contact</li>
          </ul>
        </div>
      </>
      <Script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></Script>
      <Script src="/js/functions-min.js"></Script>
    </div>
  )
}
