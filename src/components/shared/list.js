import './list.scss';

const List = ({headers, items, isLoading, lastItemRef}) => {

    return (
        <table className="list">
            <thead>
                <tr>
                    {
                        headers.map((item, i) => (
                            <th key={i}>
                                {
                                    item
                                }
                            </th>
                        ))
                    }
                </tr>
            </thead>
            <tbody>
                {
                    items && items.map((item, i) => (
                        <tr key={i} ref={i === items.length-1 ? lastItemRef : null}>
                            {
                                headers.map((header, i) => (
                                    <td key={i}>{item[header]}</td>
                                ))
                            }
                        </tr>
                    ))
                }
                {
                    isLoading && 
                    <tr className="is-loading">
                        <td>Loading...</td>
                    </tr>
                }
            </tbody>
        </table>
    )
}

export default List;