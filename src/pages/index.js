import {useRef,useState,useEffect} from 'react';
import Head from 'next/head';
import { Cloudinary } from '@cloudinary/url-gen';
import Layout from '@components/Layout';
import Container from '@components/Container';
import Button from '@components/Button';
import Webcam from "react-webcam";
import styles from '@styles/Home.module.scss';



const videoConstraints = {
  width: 560,
  height:600,
  aspectRatio:1
};
const cloudinary = new Cloudinary({
  cloud: {
    cloudName:process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  },
  url: {
    secure: true
  }
});

const ART_FILTERS = [
  'al_dente',
  'athena',
  'audrey',
  'aurora',
  'daguerre',
  'eucalyptus',
  'fes',
  'frost',
  'hairspray',
  'hokusai',
  'incognito',
  'linen',
  'peacock',
  'primavera',
  'quartz',
  'red_rock',
  'refresh',
  'sizzle',
  'sonnet',
  'ukulele',
  'zorro'
];

export default function Home() {
  const webcamRef=useRef();
  const [imageSrc,setImageSrc]=useState();
  const [cldData,setCldData]=useState();
  const [filter, setFilter] = useState();
  
 
  let src=imageSrc;
  const cldImage = cldData && cloudinary.image(cldData.public_id);
  console.log("imagexyz",cldImage)
    //src = cldImage.toURL();
    if ( cldImage ) {
    
      if ( filter ) {
        cldImage.effect(`e_art:${filter}`);
      }
      src = cldImage.toURL();
    }
    console.log("source",src);
   
    console.log(filter);

  useEffect(()=>{
    if(!imageSrc) return;
   // console.log("hey");
    (async function run(){
     // console.log("me");
     
      const response=await fetch('/api/cloudinary/upload', {
      method : 'POST',
      body: JSON.stringify({
        image:imageSrc
      })
    }).then(r=>r.json())
    setCldData(response);
    console.log('response',response)
  })();
  },[imageSrc])
  function handleOnCapture(){
    const image=webcamRef.current.getScreenshot();
    setImageSrc(image)
    //console.log('image',image);
  }
  
  return (
    <Layout>
      <Head>
        <title>Camera App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <div className={styles.camera}>

          <div className={styles.stageContainer}>
            <div className={styles.stage}>
              {src && <img src={src}/>}
              {!src && <Webcam ref={webcamRef} videoConstraints={videoConstraints}  />}
            </div>
          </div>

          <div className={styles.controls}>
            <ul>
              <li>
                <Button onClick={handleOnCapture}>
                  Capture photo
                </Button>
              </li>
              <li>
                <Button onClick={() => setImageSrc(undefined) && setCldData(undefined)} color="red">
                  Reset
                </Button>
              </li>
            </ul>
          </div>
        </div>

        {cldData && (
          <div className={styles.effects}>
          
            <h2>Filters</h2>
            <ul className={styles.filters}>
              {ART_FILTERS.map(filter => {
                return (
                  <li key={filter} data-is-active-filter={false}>
                    <button className={styles.filterThumb} onClick={() => setFilter(filter)}>
                      <img width="100" height="100" src={
                        cloudinary.image(cldData?.public_id)
                          .resize('w_200,h_200')
                          .effect(`e_art:${filter}`)
                          .toURL()
                      } alt={filter} />
                      <span>{ filter }</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
        
        
      
      </Container>
    </Layout>
  )
}