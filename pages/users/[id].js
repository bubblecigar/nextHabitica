
const User = props => {
    return (
    <div>
        {props.params.id}
    </div>)
}

export default User


export async function getStaticPaths() {
    // Return a list of possible value for id
    return { 
        paths: [
        { params: { id: '12345' }},
        { params: { id: '1' }}
    ],
     fallback: false 
    }
  }
  
  export async function getStaticProps({ params }) {
    // Fetch necessary data for the blog post using params.id
    return {
        props: {
            params
        }
    }
  }