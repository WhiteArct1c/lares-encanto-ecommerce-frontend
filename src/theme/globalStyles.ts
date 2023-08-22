import { createGlobalStyle } from "styled-components";


export const GlobalStyle = createGlobalStyle`

   *::-webkit-scrollbar{
      width: 15px;
      background: #000;
      border-radius: 5px;
   }

   *::-webkit-scrollbar-thumb {
      background: #fff; 
      border-radius: 5px;
      border: 3px solid black
   }

   *::-webkit-scrollbar-button {
      display: none; 
   }

   body{
      padding: 0;
      margin: 0;
      box-sizing: border-box;

      background-color: #EFF2F6;

      font-family: 'Public Sans', sans-serif;
      font-weight: 400;
   }
`