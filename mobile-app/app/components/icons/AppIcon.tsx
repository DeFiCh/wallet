import Svg, { SvgProps } from 'react-native-svg'

export function AppIcon (props: SvgProps): JSX.Element {
  return (
    <Svg
      height={52}
      viewBox='0 0 53 52'
      width={53}
      {...props}
    >
      <path
        d='M45.8662 8.82329C42.6507 5.16122 38.7057 2.60298 34.0685 1.13368C32.163 0.529547 30.1979 0.171543 28.2031 0.0298336C27.6076 -0.0149168 27.0122 0.0298336 26.372 0.0298336V21.9203C26.2008 21.7636 26.0892 21.6741 25.9924 21.5772C25.1736 20.7567 24.3772 19.9139 23.5287 19.1308C23.1193 18.7504 22.9779 18.3402 22.9481 17.8107C22.8439 15.4538 22.7099 13.097 22.5982 10.7326C22.5834 10.4865 22.6206 10.2255 22.695 9.99426C23.4617 7.65978 24.2358 5.34022 25.0099 3.00574C25.3374 2.02869 25.6575 1.05164 25.9924 0.0298336C25.8436 0.0149168 25.7468 0 25.6426 0C23.7371 0.0298336 21.8614 0.320711 20.0154 0.768216C19.7847 0.827883 19.673 0.932301 19.606 1.14859C19.3157 2.05106 19.018 2.95353 18.7203 3.856C18.5044 4.51234 18.2811 5.17613 18.0429 5.86231C17.8866 5.79518 17.7675 5.74297 17.6484 5.68331C16.316 5.01205 14.9762 4.35571 13.6513 3.66954C13.3982 3.54274 13.2047 3.51291 12.9665 3.68445C11.7682 4.56454 10.5474 5.42972 9.34906 6.31727C8.95456 6.60815 8.61961 6.97361 8.23255 7.33161C8.38886 7.41366 8.50051 7.48078 8.61961 7.54045C11.2769 8.8755 13.9267 10.2106 16.5914 11.5307C16.8669 11.6649 16.9785 11.829 16.9859 12.1348C17.0157 13.0522 17.0827 13.9621 17.1125 14.8795C17.1348 15.4986 17.1125 16.1251 17.1125 16.7665C16.8817 16.7665 16.6212 16.774 16.3607 16.7665C15.0879 16.7068 13.8151 16.6248 12.5423 16.5726C12.2371 16.5577 12.0733 16.4532 11.9393 16.1773C10.8973 14.0591 9.83288 11.9558 8.77592 9.8451C8.44097 9.1813 8.10602 8.5175 7.76362 7.82387C7.68174 7.89099 7.62964 7.92829 7.57754 7.98049C6.2154 9.41997 5.02446 10.9937 4.01961 12.7091C3.96006 12.8135 3.98239 13.0075 4.0345 13.1268C4.7044 14.4991 5.39663 15.864 6.07398 17.2364C6.13352 17.3557 6.18563 17.475 6.25262 17.6168C6.08142 17.6839 5.94 17.7435 5.79857 17.7883C4.37689 18.2656 2.94776 18.7355 1.52608 19.2203C1.38466 19.2651 1.21346 19.4291 1.18369 19.5634C0.938056 20.8835 0.707312 22.2111 0.498898 23.5387C0.409578 24.0981 0.387248 24.6575 0.335144 25.2243V25.6569C1.3921 25.2915 2.44162 24.926 3.49857 24.5754C5.79857 23.8072 8.09857 23.0465 10.406 22.2857C10.5921 22.226 10.808 22.1813 11.0015 22.1888C12.7656 22.2708 14.5296 22.3603 16.3012 22.4573C17.1274 22.502 17.961 22.5468 18.7872 22.599C18.8766 22.599 18.9882 22.6363 19.0478 22.6959C20.127 23.7625 21.1914 24.8365 22.2856 25.9254C22.2037 26.0224 22.1368 26.1119 22.0698 26.1865C21.117 27.1411 20.1717 28.1033 19.2041 29.043C19.0626 29.1847 18.817 29.2742 18.616 29.2892C16.5542 29.416 14.485 29.5204 12.4232 29.6322C11.917 29.6621 11.4109 29.6919 10.9122 29.7068C10.7856 29.7068 10.6516 29.6845 10.5251 29.6472C7.19793 28.5433 3.87074 27.4395 0.551002 26.3282C0.484011 26.3058 0.424464 26.2685 0.357474 26.2387V26.7458C0.409578 27.2829 0.439351 27.8273 0.521228 28.3569C0.729642 29.6845 0.960387 31.0121 1.21346 32.3322C1.23579 32.4664 1.41443 32.6305 1.54841 32.6753C2.97009 33.1675 4.39178 33.63 5.8209 34.1073C5.96233 34.1595 6.10375 34.2192 6.27495 34.2788C6.20796 34.428 6.15585 34.5473 6.09631 34.6592C5.41152 36.0241 4.72673 37.389 4.05683 38.7688C3.99728 38.8956 3.98984 39.1044 4.05683 39.2163C5.06912 40.9317 6.26751 42.5204 7.64453 43.9598C7.6743 43.9897 7.71896 44.0121 7.77851 44.0568C7.97203 43.669 8.16556 43.2886 8.35165 42.9157C9.55003 40.5141 10.7633 38.1199 11.9542 35.7183C12.0882 35.4423 12.252 35.3379 12.5571 35.3305C13.9639 35.2783 15.3707 35.2037 16.7775 35.1142C17.1274 35.0918 17.239 35.1813 17.2167 35.5468C17.1274 36.9639 17.0604 38.3884 17.0008 39.8055C16.9859 40.0815 16.8892 40.2381 16.6361 40.3574C13.9788 41.6776 11.3215 43.0126 8.66427 44.3477C8.53773 44.4148 8.41119 44.4819 8.24 44.5714C8.55262 44.8549 8.83547 45.1084 9.11831 45.3695C10.339 46.4733 11.6714 47.4131 13.0707 48.2708C13.2717 48.3901 13.4206 48.3603 13.5992 48.2708C14.9465 47.5846 16.3012 46.9059 17.6559 46.2272C17.7749 46.1675 17.894 46.1228 18.0355 46.0557C18.1025 46.2421 18.1694 46.3987 18.2215 46.5554C18.683 47.9501 19.1445 49.3374 19.5986 50.7321C19.673 50.9558 19.7698 51.0901 20.0228 51.1498C21.8762 51.5898 23.7445 51.8956 25.65 51.918C25.7245 51.918 25.7914 51.918 25.8659 51.9105C25.8957 51.9105 25.9254 51.8807 25.985 51.8508C25.6649 50.8812 25.3523 49.9117 25.0322 48.9495C24.2581 46.6076 23.4766 44.2731 22.7025 41.9312C22.628 41.7 22.5908 41.4389 22.6057 41.1928C22.7173 38.821 22.8513 36.4492 22.9555 34.0849C22.9779 33.5777 23.1193 33.1899 23.5063 32.8244C24.3623 32.0264 25.1662 31.1836 25.9924 30.3557C26.0892 30.2588 26.1934 30.1693 26.3571 30.0275C26.372 30.2215 26.3869 30.3333 26.3869 30.4452C26.3869 37.5232 26.3869 44.6013 26.3869 51.6793C26.3869 51.7837 26.372 51.8956 26.3646 52H27.0122C27.1759 51.9702 27.3397 51.9403 27.5034 51.918C28.9549 51.739 30.4287 51.6569 31.8578 51.3586C35.7804 50.5382 39.3384 48.8675 42.4571 46.3391C48.4193 41.506 51.7018 35.241 52.2675 27.5812C52.4387 25.3287 52.2824 23.0763 51.8283 20.8612C50.8979 16.319 48.9254 12.284 45.8662 8.80092V8.82329ZM32.1109 45.3844V6.51865C34.85 7.33161 37.2691 8.63683 39.4054 10.4641C43.4099 13.895 45.8364 18.2358 46.4542 23.4791C47.8312 35.1366 39.6212 43.4005 32.1109 45.3769V45.3844Z'
        fill='#FF008C'
        id='Fill-1'
      />

    </Svg>
  )
}
