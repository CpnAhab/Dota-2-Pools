import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import $ from 'jquery';

// MAKE A DENT ON CONNECTING BACK END TO FRONT END TONIGHT
// JSON OBJECTOSSSSS

function Hero(props) {
    return (
        <input 
        type="checkbox" 
        id="hero" 
        className={props.className} 
        name={props.name}
        style={{background: "url(https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/" + props.name + ".png)", backgroundSize: "cover"}}
        />
    )
}

function AttributeSelector(props) {
    return (
        <input
        type="checkbox"
        id={props.id}
        onChange={props.onChange} 
        />
    )
}

function Button(props) {

    return (
        <button
        type="submit"
        name="op"
        value={props.value}
        >
            {props.text}
        </button>
    )
}

function HeroesByAttribute(props) {
    
    function renderHero(i) {
        return (
            <Hero 
            className={props.attrStr}
            name={props.attribute[i]}
            key={i}
            />
        )
    }

    function renderAttributeSelector() {
        return(
            <AttributeSelector
            id={props.attrStr}
            onChange={props.onChange}
            />
        )
    }

    var heroes = [];
    for (var i = 0; i < props.attribute.length; i++) {
        heroes.push(renderHero(i));
    }

    return (
        <>
        <h2>{props.attrStr} {renderAttributeSelector()}</h2>
        {heroes}</>
        )
    }

function Buttons(props){

    function renderButton(val, i) {
        return(
            <div className="buttonblock">
                <Button value={val} text={i} />
            </div>
        )
    }

    return (
        <div className="submissions">
            <h1> Dota 2 Hero Pool Generator </h1>
            {renderButton("random", "Choose a random hero")}
            <h3>{props.random}</h3>
            {renderButton("to_text", "Convert to text")}
            <h3>{props.toText}</h3>
            {renderButton("download", "Export as .txt")}
            <h3>{props.download}</h3>
            {renderButton("to_sb", "Add to SquireBot")}
            <h3>{props.toSB}</h3>
        </div>
    )
    }

function Page() {

    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         str: [
    //             'abaddon', 'alchemist', 'axe', 'beastmaster', 'brewmaster', 'bristleback', 'centaur', 'chaos_knight', 'rattletrap', 'dawnbreaker', 'doom_bringer', 'dragon_knight', 'earth_spirit', 'earthshaker',
    //             'elder_titan', 'huskar', 'wisp', 'kunkka', 'legion_commander', 'life_stealer', 'lycan', 'magnataur', 'marci', 'mars', 'night_stalker', 'omniknight', 'phoenix',
    //             'pudge', 'sand_king', 'slardar', 'snapfire', 'spirit_breaker', 'sven', 'tidehunter', 'shredder', 'tiny', 'treant', 'tusk', 'abyssal_underlord', 'undying', 'skeleton_king'],
    //         agi: [
    //             'antimage', 'arc_warden', 'bloodseeker', 'bounty_hunter', 'broodmother', 'clinkz', 'drow_ranger', 'ember_spirit', 'faceless_void', 'gyrocopter', 'hoodwink', 
    //             'juggernaut', 'lone_druid', 'luna', 'medusa', 'meepo', 'mirana', 'monkey_king', 'morphling', 'naga_siren', 'nyx_assassin', 'pangolier', 'phantom_assassin', 'phantom_lancer',
    //             'razor', 'riki', 'nevermore', 'slark', 'sniper', 'spectre', 'templar_assassin', 'terrorblade', 'troll_warlord', 'ursa', 'vengefulspirit', 'venomancer', 'viper', 'weaver'],
    //         int: [
    //             'ancient_apparition', 'bane', 'batrider', 'chen', 'crystal_maiden', 'dark_seer', 'dark_willow', 'dazzle', 'death_prophet', 'disruptor', 'enchantress', 'enigma', 'grimstroke', 'invoker',
    //             'jakiro', 'keeper_of_the_light', 'leshrac', 'lich', 'lina', 'lion', 'furion', 'necrolyte', 'ogre_magi', 'oracle', 'obsidian_destroyer', 'puck', 'pugna', 'queenofpain', 'rubick',
    //             'shadow_demon', 'shadow_shaman', 'silencer', 'skywrath_mage', 'storm_spirit', 'techies', 'tinker', 'visage', 'void_spirit', 'warlock', 'windrunner', 'winter_wyvern', 'witch_doctor', 'zuus']
    //     }
    // }
    const [loading, setLoading] = useState(true);
    const [heroes, setHeroes] = useState({});
    useEffect(() => {
        console.log("fetching heroes");
        fetch('/test')
        .then(console.log("accessed /test"))
        .then(res => { 
            console.log(res);
            setLoading(false);
            return res.json();
        });
    });

    function handleChange(e) {
        if (e.target.checked) {
            $('.' + e.target.id).prop('checked', true);
        } else {
            $('.' + e.target.id).prop('checked', false);
        }
    }

    if (loading) {
        return <div> "Loading..." </div>
    }

    return (
        <div className="main">
            <div className="heropools">
                <HeroesByAttribute 
                attrStr="Strength"
                attribute={heroes.str}
                onChange={(e) => handleChange(e)}
                />
                <HeroesByAttribute
                attrStr="Agility"
                attribute={heroes.agi}
                onChange={(e) => handleChange(e)}
                />
                <HeroesByAttribute
                attrStr="Intelligence"
                attribute={heroes.int}
                onChange={(e) => handleChange(e)}
                />
            </div>
            <Buttons />
        </div>
    )
}

ReactDOM.render(
    <Page />,
    document.getElementById('root')
);
