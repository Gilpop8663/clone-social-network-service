import 'styled-components';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    bgColor: string;
    mainBlueColor: string;
    mainHoverBlueColor: string;
    blackGrayColor: string;
    blackGrayHoverColor: string;
  }
}
