export const formatCEP = (cep: string): string => {
   const formattedCEP = cep.replace(/[^\d]/g, '');
   return formattedCEP;
}

export const extractAddressType = (address: string) => {
   const words = address.split(/\s+/);

   if (words?.length > 0) {
      return words[0];
   } else {
      return "Rua";
   }
}

export const extractLogradouroWithoutType = (address: string) => {
   const words = address.split(/\s+/);
   
   if (words.length > 1) {
     return words.slice(1).join(' ');
   } else {
     return null;
   }
 }