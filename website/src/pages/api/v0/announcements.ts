import { NextApiRequest, NextApiResponse } from 'next'
import { AnnouncementData } from '@shared-types/website'
import Cors from 'cors'
import { runMiddleware } from '../../../utils/middleware'

export const cors = Cors({
  methods: ['GET', 'HEAD']
})

export default async function handle (req: NextApiRequest, res: NextApiResponse<AnnouncementData[]>): Promise<void> {
  await runMiddleware(req, res, cors)
  res.json([{
    lang: {
      en: 'Vaults with DUSD are halted unexpectedly due to the price fluctuation protection for 120 blocks (approx. 60 minutes). DUSD should be open for loan payback and collateral at Block 1,605,120.',
      de: 'Vaults with DUSD are halted unexpectedly due to the price fluctuation protection for 120 blocks (approx. 60 minutes). DUSD should be open for loan payback and collateral at Block 1,605,120.',
      'zh-Hans': 'Vaults with DUSD are halted unexpectedly due to the price fluctuation protection for 120 blocks (approx. 60 minutes). DUSD should be open for loan payback and collateral at Block 1,605,120.',
      'zh-Hant': 'Vaults with DUSD are halted unexpectedly due to the price fluctuation protection for 120 blocks (approx. 60 minutes). DUSD should be open for loan payback and collateral at Block 1,605,120.',
      fr: 'Vaults with DUSD are halted unexpectedly due to the price fluctuation protection for 120 blocks (approx. 60 minutes). DUSD should be open for loan payback and collateral at Block 1,605,120.'
    },
    version: '<=1.0.0',
    id: '0',
    url: {
      ios: 'https://apps.apple.com/us/app/defichain-wallet/id1572472820',
      android: 'https://play.google.com/store/apps/details?id=com.defichain.app',
      web: '',
      windows: '',
      macos: ''
    }
  }, {
    lang: {
      en: 'Vaults with DUSD are halted unexpectedly due to the price fluctuation protection for 120 blocks (approx. 60 minutes). DUSD should be open for loan payback and collateral at Block 1,605,120.',
      de: 'Vaults with DUSD are halted unexpectedly due to the price fluctuation protection for 120 blocks (approx. 60 minutes). DUSD should be open for loan payback and collateral at Block 1,605,120.',
      'zh-Hans': 'Vaults with DUSD are halted unexpectedly due to the price fluctuation protection for 120 blocks (approx. 60 minutes). DUSD should be open for loan payback and collateral at Block 1,605,120.',
      'zh-Hant': 'Vaults with DUSD are halted unexpectedly due to the price fluctuation protection for 120 blocks (approx. 60 minutes). DUSD should be open for loan payback and collateral at Block 1,605,120.',
      fr: 'Vaults with DUSD are halted unexpectedly due to the price fluctuation protection for 120 blocks (approx. 60 minutes). DUSD should be open for loan payback and collateral at Block 1,605,120.'
    },
    version: '>=1.1.0',
    id: '1'
  }])
}
