import colorsGroup from "./colorsGroup";
import stylesPalette from "./stylesPalette";

export default function getTitleFeed(queryList,routerQuery,isMounted){
    if (isMounted.current) {
        return queryList.query.length===0 ? `${queryList.sort} Color Palettes - Palettes` : queryList.query.length===1 ? queryList.query[0].type!=='search' ? `${queryList.query[0].value} Color Palettes - Palettes` : 'Explore Color Palettes - Palettes' : 'Explore Color Palettes - Palettes'
    }else {
        const [sortBy, queryPalette] = routerQuery;
        return !queryPalette ? `${sortBy.charAt(0).toUpperCase()+sortBy.slice(1)} Color Palettes - Palettes` : queryPalette?.split(',').length===1 ? colorsGroup.concat(stylesPalette).map(q=>q.value.toLowerCase()).includes(queryPalette?.split(',')[0].toLowerCase()) ? `${queryPalette?.split(',')[0].charAt(0).toUpperCase()+queryPalette?.split(',')[0].slice(1)} Color Palettes - Palettes` : 'Explore Color Palettes - Palettes' : 'Explore Color Palettes - Palettes'
    }
}