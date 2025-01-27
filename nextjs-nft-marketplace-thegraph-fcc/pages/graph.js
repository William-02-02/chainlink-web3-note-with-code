import { useQuery, gql } from "@apollo/client"


const GET_ACTIVE_NFTS = gql`
    {
    activeNfts(first: 5, where: {buyer: null}) {
        id
        buyer
        seller
        nftAddress
        price
        tokenId
    }
    }
`

export default function Graph() {

    const { loading, error, data} = useQuery(GET_ACTIVE_NFTS)
    console.log(data);

    return <div>Graph</div>
}
