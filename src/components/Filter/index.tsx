import './Filter.css';
import {MarketType} from "../../config/constants";

export default function Filter(props: any) {
  return (
    <div className='filter'>
      <h3>Filter</h3>
      <select name='marketType' defaultValue={MarketType.SHARES} onChange={e => props.updateMarketType(e.target.value)}>
        <option value={MarketType.SHARES}>Shares</option>
        <option value={MarketType.CRYPTOCURRENCIES}>Crypto</option>
        <option value={MarketType.CURRENCIES}>Forex</option>
        <option value={MarketType.COMMODITIES}>Commodity</option>
      </select>
    </div>
  );
}
