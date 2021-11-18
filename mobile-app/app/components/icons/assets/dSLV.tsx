import * as React from 'react'
import Svg, { Path, SvgProps, Circle } from 'react-native-svg'

export function dSLV (props: SvgProps): JSX.Element {
  return (
    <Svg width='32' height='32' viewBox='0 0 32 32' fill='none' {...props}>
      <Circle cx='16' cy='16' r='16' fill='#DC7E00' />
      <Path d='M8.29525 17.2905H6.6674C6.66026 17.7617 6.74594 18.1687 6.92443 18.5114C7.10292 18.8541 7.3421 19.1361 7.64197 19.3574C7.94897 19.5788 8.29882 19.7394 8.6915 19.8394C9.09132 19.9465 9.50185 20 9.92309 20C10.4443 20 10.9012 19.9393 11.2939 19.8179C11.6937 19.6966 12.0257 19.5288 12.2899 19.3146C12.5612 19.0933 12.7647 18.8327 12.9003 18.5328C13.036 18.2329 13.1038 17.9081 13.1038 17.5582C13.1038 17.1299 13.011 16.78 12.8254 16.5087C12.6469 16.2303 12.4327 16.0089 12.1828 15.8447C11.9329 15.6805 11.6795 15.5627 11.4224 15.4913C11.1725 15.4128 10.9762 15.3592 10.8334 15.3307C10.355 15.2093 9.96593 15.1093 9.66607 15.0308C9.37334 14.9523 9.1413 14.8737 8.96995 14.7952C8.80574 14.7166 8.69507 14.631 8.63795 14.5382C8.58084 14.4453 8.55228 14.324 8.55228 14.174C8.55228 14.0098 8.58798 13.8742 8.65937 13.7671C8.73077 13.66 8.82001 13.5707 8.92711 13.4993C9.04134 13.4279 9.16629 13.378 9.30194 13.3494C9.4376 13.3208 9.57325 13.3066 9.7089 13.3066C9.91595 13.3066 10.1052 13.3244 10.2765 13.3601C10.455 13.3958 10.6121 13.4565 10.7477 13.5422C10.8834 13.6278 10.9905 13.7456 11.069 13.8956C11.1547 14.0455 11.2047 14.2347 11.2189 14.4632H12.8468C12.8468 14.0205 12.7611 13.6457 12.5898 13.3387C12.4255 13.0245 12.2006 12.7675 11.9151 12.5676C11.6295 12.3677 11.3011 12.2249 10.9298 12.1392C10.5657 12.0464 10.1837 12 9.78387 12C9.44117 12 9.09846 12.0464 8.75576 12.1392C8.41305 12.232 8.10605 12.3748 7.83474 12.5676C7.56343 12.7604 7.3421 13.0031 7.17075 13.2958C7.00654 13.5814 6.92443 13.9206 6.92443 14.3133C6.92443 14.6631 6.98869 14.963 7.1172 15.2129C7.25286 15.4556 7.42778 15.6591 7.64197 15.8233C7.85616 15.9875 8.09891 16.1232 8.37022 16.2303C8.64152 16.3302 8.91997 16.4159 9.20556 16.4873C9.484 16.5658 9.75888 16.6372 10.0302 16.7015C10.3015 16.7657 10.5442 16.8407 10.7584 16.9264C10.9726 17.012 11.144 17.1191 11.2725 17.2477C11.4081 17.3762 11.476 17.544 11.476 17.751C11.476 17.9438 11.426 18.1044 11.326 18.2329C11.2261 18.3543 11.1011 18.4507 10.9512 18.5221C10.8013 18.5935 10.6406 18.6435 10.4693 18.672C10.2979 18.6934 10.1373 18.7041 9.98735 18.7041C9.76602 18.7041 9.55183 18.6792 9.34478 18.6292C9.13773 18.5721 8.95567 18.49 8.7986 18.3829C8.64866 18.2686 8.52729 18.1223 8.43447 17.9438C8.34166 17.7653 8.29525 17.5475 8.29525 17.2905Z' fill='white' />
      <Path d='M14.1042 12.1821V19.8286H19.5125V18.415H15.7856V12.1821H14.1042Z' fill='white' />
      <Path d='M23.025 19.8286L25.5632 12.1821H23.8282L22.104 17.5582H22.0826L20.3798 12.1821H18.6555L21.1294 19.8286H23.025Z' fill='white' />
    </Svg>
  )
}
