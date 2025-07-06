import clientData from './data/clientData.json';
import priceData from './data/priceDats.json';
import siteData from './data/siteData.json';

export const config = {
  ...siteData,
  clients: clientData,
  pricing: priceData
};