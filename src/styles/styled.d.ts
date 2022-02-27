import 'styled-components';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    bgColor: string;
    mainBlueColor: string;
    mainHoverBlueColor: string;
    mainWhiteBlueColor: string;
    blackGrayColor: string;
    blackGrayHoverColor: string;
    greenColor: string;
    baseBorderStyle: string;
  }
}
