function Hero(props) {
    
    return (
        <input 
        type="checkbox" 
        id="hero" 
        className={props.className} 
        name={props.name}
        onChange={props.onChange}
        checked={props.checked}
        style={{background: "url(https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/" + props.name + ".png)", backgroundSize: "cover"}}
        />
    )
}

export function Button(props) {

    return (
        <div className="buttonblock">
            <button
            type="submit"
            name="op"
            value={props.value}
            onClick={props.onClick}
            >
                {props.text}
            </button>
        </div>
    )
}

export function HeroesByAttribute(props) {
    
    function renderHero(i) {

        return (
            <Hero 
            className={props.attrStr}
            name={props.attribute[i]}
            onChange={() => props.onHeroChange(i+props.startVal)}
            checked={props.checkedHeroes[i+props.startVal]}
            key={i}
            />
        )
    }

    let heroes = [];
    for (let i = 0; i < props.attribute.length; i++) {
        heroes.push(renderHero(i));
    }

    return (
        <>
        <h2>
            {props.attrStr} <input type="checkbox" id={props.attrStr} onChange={props.onChange} />
        </h2>
        {heroes}</>
        )
    }