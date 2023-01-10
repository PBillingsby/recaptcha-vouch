import Head from 'next/head'
import React, { useState, useRef } from 'react'
import styles from '../styles/Home.module.css'
import ReCAPTCHA from 'react-google-recaptcha'
import Arweave from 'arweave'
import axios from 'axios'
import { CircleCheck } from 'tabler-icons-react';
import { isVouched } from '../utils/isVouched'

const arweave = Arweave.init({
  protocol: 'https',
  port: '443',
  host: 'arweave.net'
})

export default function Home() {
  const [address, setAddress] = useState<string | undefined>()
  const [validated, setValidated] = useState<any>()
  const [vouched, setVouched] = useState<boolean>()
  const captchaRef = useRef<any>(null)

  const connect = async () => {
    if (!address) {
      if (!window.arweaveWallet) {
        window.open("https://arconnect.io", "_blank");
      }
      await window.arweaveWallet.connect(["ACCESS_ADDRESS", "SIGN_TRANSACTION"], {
        name: "Vouch DAO v0",
      });
      setAddress(await window.arweaveWallet.getActiveAddress());
    }
  }

  const handleSubmit = async () => {
    try {
      const token = captchaRef.current?.getValue();
      await checkVouch(address!)
      await axios.post('api/register', { token, address })
        .then(res => {
          setValidated(res)
        })
        .catch((error) => {
          console.log(error);
        })
      setTimeout(() => captchaRef.current?.reset(), 500);
    } catch (err) {
      console.log(err)
    }
  }

  const vouchAddress = async () => {
    const tx = await arweave.createTransaction({
      data: JSON.stringify({ address })
    })

    await arweave.transactions.sign(tx)
    await axios.post('api/vouch', tx)
      .then(async (res) => {
        if (res.status === 200) {
          await checkVouch(address!)
        }
        return res.status
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const checkVouch = async (address: string) => {
    const isVouchedBy: boolean = await isVouched(address!)
    setVouched(isVouchedBy)
  }
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <h2 className="text-5xl text-center mt-12 font-bold">Get VOUCHED</h2>
        <main className={styles.main}>
          <p className="max-w-lg text-center">Vouch reCaptcha Service is a registered server of Vouch DAO, this server allows users to leverage the power of reCaptcha to create a Vouch Record for Web of Value Services.</p>
          {
            address ? (
              <div className="mt-8">
                {
                  vouched
                    ? (
                      <div className="flex gap-2">
                        <CircleCheck size={28} strokeWidth={2} color={'#50bf40'} />
                        <p className="pt-1 font-bold text-[#50bf40]">Already Vouched</p>
                      </div>
                    )
                    :
                    <div>
                      <button
                        onClick={vouchAddress}
                        type="submit"
                        className={`${!validated ? 'hidden' : ''} text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800`}
                      >
                        Vouch For {`${address.slice(0, 8)}...${address.slice(
                          address.length - 8
                        )}`}
                      </button>
                      <ReCAPTCHA
                        size="normal"
                        className={validated ? 'hidden' : ''}
                        onChange={handleSubmit}
                        ref={captchaRef}
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                      />
                    </div>
                }
              </div>
            )
              :
              (
                <div>
                  <button type="button" onClick={connect} className="mx-10 my-4 bg-black border border-white hover:bg-white hover:text-black hover:border hover:border-black text-white font-bold py-4 px-10 rounded-full">Get Vouched</button>
                  <button className="mx-10 my-4 bg-white border border-black hover:bg-black hover:border hover:border-white hover:text-white text-black font-bold py-4 px-10 rounded-full">
                    <a href="https://vouch-dao.arweave.dev" target="_blank">
                      Learn More
                    </a>
                  </button>
                </div>
              )
          }
        </main>
      </div >
    </>
  )
}
