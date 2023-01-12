import { WarpFactory } from 'warp-contracts'
import fs from 'fs'

let wallet: any
if (process.env.NODE_ENV === 'production') {
  wallet = JSON.parse(atob(process.env.NEXT_PUBLIC_KEYFILE!))
}
else {
  wallet = JSON.parse(fs.readFileSync((process.cwd(), "wallet.json"), 'utf-8'))
}
const VOUCH = '_z0ch80z_daDUFqC9jHjfOL8nekJcok4ZRkE_UesYsk'
const warp = WarpFactory.forMainnet()

export default async function (ctx: { address: string, transaction: string }) {
  const vouchContract = warp.contract(VOUCH)

  return await vouchContract.connect(JSON.parse(wallet)).writeInteraction({
    function: 'addVouchedUser',
    ...ctx
  }).then(
    () => vouchContract.readState())
    // @ts-ignore
    .then(({ cachedValue }) => cachedValue.state.vouched[ctx.address] ? { ok: true } : { ok: false })
}