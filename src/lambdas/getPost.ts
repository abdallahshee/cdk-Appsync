import {AppSyncResolverHandler} from 'aws-lambda'
import {QueryGetPostArgs,Query, Post} from '../graphql'

// export class handler:AppSyncResolverHandler<QueryGet>=async(event)=>{
// //  const params=event
// };
export const handler:AppSyncResolverHandler<QueryGetPostArgs,Query['getPost']>=async(event)=>{
    const id=String(event.arguments.id)
    const posts:Post[]=[
        {
            id:'1',
            title:'Home Coming',
            content:'We are coming to our beautiful home'
        },
        {
            id:'2',
            title:'Beach Exercising',
            content:'Beach going for a beach trip tomorrow',
        },
        {
            id:'3',
            title:'Idd Celebration',
            content:'Muslims mark the end of Ramadhan by celebrating Idd ul Fitr',
        }
    ]
    const post:Post=posts.filter((post)=>post.id===id)[1]
    return post
}