import Bundlr from '@bundlr-network/client'
import fs from 'fs'

let wallet: any
if (process.env.NODE_ENV === 'production') {
  wallet = JSON.parse(atob(process.env.NEXT_PUBLIC_KEYFILE!))
}
else {
  wallet = JSON.parse(fs.readFileSync((process.cwd(), "wallet.json"), 'utf-8'))
}

const bundlr = new Bundlr('https://node2.bundlr.network', 'arweave', JSON.parse(wallet))

export default async function (ctx: { address: string }) {
  const tags = [
    { name: 'Content-Type', value: 'application/json' },
    { name: 'App-Name', value: 'Vouch' },
    { name: 'App-Version', value: '0.1' },
    { name: 'Verification-Method', value: 'reCaptcha' },
    { name: 'Vouch-For', value: ctx.address }
  ]

  const data = JSON.stringify({
    address: ctx.address,
    service: 'RECAPTCHA',
    type: 'Vouch'
  })

  // APPROACH 1
  try {
    const tx = bundlr.createTransaction(data, { tags })
    await tx.sign()
    const result = await tx.upload()
    // @ts-ignore
    return { ...ctx, transaction: result.id }
  } catch (err) {
    console.error
  }
}