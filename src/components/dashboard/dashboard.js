import './dashboard.scss';
import List from '../shared/list';
import { ethers } from "ethers";
import {useState, useCallback, useRef, useEffect} from 'react';
import { apiKeys } from '../../vars/apiKeys';
import { getTransactions } from '../../services/api/transactions';
import { ethAddresses } from '../../vars/ethAddresses';

const Dashboard = () => {

    const [items, setItems] = useState(null);
    const [error, setError] = useState(false);
    const [pageNumber, setPageNumber] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [ethAddress, setEthAddress] = useState('');

    const observer = useRef();

    useEffect(() => {
        if(!pageNumber) return;
        const abordFetch = new AbortController();
        setError(false);
        setIsLoading(true);
        getTransactions({
            module: 'account', 
            action: 'txlist', 
            address: ethAddress,
            startblock: 0, 
            endblock: 99999999, 
            page: pageNumber, 
            offset: 40, 
            sort: 'asc', 
            apikey: apiKeys.sergey
        }, abordFetch).then((res) => {
            setIsLoading(false);
            setItems(prevItems => {
                return [...prevItems || [], ...res.result];
            });
        }).catch((err) => {
            setHasMore(false);
            setError(err);
            setIsLoading(false);
        });

        return () => {
            abordFetch.abort();
          };

    }, [pageNumber, ethAddress]);

    const lastAddressRef = useCallback((node) => {
        if(isLoading) {
            return;
        }
        if(observer.current) {
            observer.current.disconnect();
        }
        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && hasMore) {
                setPageNumber(prevPageNumber => prevPageNumber + 1);
            }
        });
        if(node) {
            observer.current.observe(node);
        }
    }, [isLoading, hasMore]);

    const onGetTransactions = () => {
        setItems([]);
        if(ethers.utils.isAddress(ethAddress)) {
            setHasMore(true);
            setPageNumber(1);
        } else {
            setError('Ethereum address is not valid');
        }
    }

    const headers = [
        'timeStamp',
        'from',
        'to',
        'value', 
        'confirmations',
        'hash'
    ];

    return (
        <div className="dashboard">
            <div className="example-eth-address">Example address: {ethAddresses.default}</div>
            <button onClick={onGetTransactions}>get transactions</button>
                   
            <input className="eth-address" placeholder="Etherium Address" type="text" value={ethAddress} onChange={(e) => {
                setEthAddress(e.target.value)
            }}/>
            <List headers={headers} items={items} isLoading={isLoading} lastItemRef={lastAddressRef}/>
            {
                error &&
                <div className="error-message">{error}</div>
            }
        </div>
    )
}

export default Dashboard;