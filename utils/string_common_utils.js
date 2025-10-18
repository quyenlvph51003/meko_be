const stringCommonUtils={
    queryPostDetail:(condition)=>{
        return `select
                    p.id as id,
                    p.user_id as userId,
                    p.title,
                    p.description,
                    p.price,
                    p.address,
                    p.is_hidden as isHidden,
                    p.status,
                    p.expired_at as expiredAt,
                    p.is_pinned as isPinned,
                    p.created_at as createdAt,
                    p.updated_at as updatedAt,
                    GROUP_CONCAT(DISTINCT ip.image_url) AS images,
                    GROUP_CONCAT(DISTINCT c.name) AS categories
                
                from post p
                left join 
                    image_post ip on p.id = ip.post_id
                left join 
                    post_categories pc on p.id = pc.post_id
                left join 
                    categories c on pc.category_id=c.id
                where ${condition}
                GROUP BY 
                    p.id, p.user_id, p.title, p.description, p.price, p.address, 
                    p.is_hidden, p.status, p.expired_at, p.is_pinned, p.created_at, p.updated_at;`
    }
}
module.exports=stringCommonUtils;
