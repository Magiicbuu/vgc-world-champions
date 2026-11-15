"""Construye los JSON definitivos de la web a partir de Limitless + datos curados + PokéAPI."""
import html
import json
import re
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "src" / "data"
CACHE = ROOT / "scripts" / ".cache"
CACHE.mkdir(exist_ok=True)

TYPE_ES = {
    "normal": "Normal", "fire": "Fuego", "water": "Agua", "electric": "Eléctrico",
    "grass": "Planta", "ice": "Hielo", "fighting": "Lucha", "poison": "Veneno",
    "ground": "Tierra", "flying": "Volador", "psychic": "Psíquico", "bug": "Bicho",
    "rock": "Roca", "ghost": "Fantasma", "dragon": "Dragón", "dark": "Siniestro",
    "steel": "Acero", "fairy": "Hada", "stellar": "Estelar", "unknown": "Desconocido",
}
CATEGORY_ES = {"physical": "Físico", "special": "Especial", "status": "Estado"}
NATURE_ES = {
    "Hardy": "Fuerte", "Lonely": "Solitario", "Brave": "Audaz", "Adamant": "Firme",
    "Naughty": "Pícaro", "Bold": "Osada", "Docile": "Dócil", "Relaxed": "Plácida",
    "Impish": "Agitada", "Lax": "Floja", "Timid": "Miedosa", "Hasty": "Activa",
    "Serious": "Seria", "Jolly": "Alegre", "Naive": "Ingenua", "Modest": "Modesta",
    "Mild": "Afable", "Quiet": "Mansa", "Bashful": "Tímida", "Rash": "Alocada",
    "Calm": "Serena", "Gentle": "Amable", "Sassy": "Grosera", "Careful": "Cauta",
    "Quirky": "Rara",
}
SLUG_FIX = {
    "ogerpon-hearthflame": "ogerpon-hearthflame-mask",
    "thundurus": "thundurus-incarnate",
    "tornadus": "tornadus-incarnate",
    "landorus": "landorus-therian",
    "basculegion": "basculegion-male",
}
ABILITY_FIX = {
    "Electric Terrain": "electric-surge",
    "Misty Terrain": "misty-surge",
    "Grassy Terrain": "grassy-surge",
    "Psychic Terrain": "psychic-surge",
    "As One": "as-one-spectrier",
}
MOVE_FIX = {"Dragon Ascend": "Dragon Ascent"}

FLAG = lambda code: "".join(chr(ord(c) + 127397) for c in code) if code else ""


def fetch_json(url):
    key = re.sub(r"[^a-zA-Z0-9]+", "_", url)[-180:]
    path = CACHE / (key + ".json")
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    last = None
    for attempt in range(5):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "vgc-tfg/1.0 (educational project)"})
            with urllib.request.urlopen(req, timeout=40) as r:
                data = json.load(r)
            path.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
            time.sleep(0.05)
            return data
        except urllib.error.HTTPError as e:
            last = e
            if e.code == 404:
                raise
            time.sleep(1 + attempt)
        except Exception as e:  # noqa: BLE001
            last = e
            time.sleep(1 + attempt)
    raise RuntimeError(f"No se pudo descargar {url}: {last}")


def es_name(data, fallback):
    for n in data.get("names", []):
        if n["language"]["name"] == "es":
            return n["name"]
    return fallback


def es_effect(data):
    for e in data.get("effect_entries", []):
        if e["language"]["name"] == "es":
            return e.get("short_effect") or e.get("effect", "")
    for e in data.get("effect_entries", []):
        if e["language"]["name"] == "en":
            return e.get("short_effect") or e.get("effect", "")
    return ""


def move_slug(name):
    n = html.unescape(name)
    n = re.sub(r"\s*\[.*?\]", "", n)
    n = n.lower().replace("'", "").replace(".", "").replace(" ", "-")
    return re.sub(r"-+", "-", n)


def ability_slug(name):
    n = html.unescape(name).lower().replace("'", "").replace(".", "").replace(" ", "-")
    return re.sub(r"-+", "-", n)


def item_slug(name):
    n = html.unescape(name).lower().replace("'", "").replace(".", "")
    n = n.replace("é", "e").replace(" ", "-")
    return re.sub(r"-+", "-", n)


def P(slug, item=None, ability=None, nature=None, evs=None, ivs=None, moves=None, level=None,
      confidence="report", note=None, tera=None):
    return {"slug": slug, "item": item, "ability": ability, "nature": nature, "evs": evs,
            "ivs": ivs, "moves": moves or [], "level": level, "confidence": confidence,
            "note": note, "teraType": tera}


MANUAL_TEAMS = {
    2008: [
        P("smeargle", "Focus Sash", "Own Tempo", moves=["Dark Void", "Endeavor", "Fake Out", "Follow Me"],
          level=1, confidence="comunidad", note="Nivel 1 para abusar de Endeavor y Dark Void."),
        P("bronzong", "Chesto Berry", "Levitate", moves=["Hypnosis", "Psychic", "Trick Room", "Explosion"],
          level=50, confidence="comunidad"),
        P("snorlax", "Sitrus Berry", "Immunity", moves=["Return", "Fire Punch", "Protect", "Belly Drum"],
          level=50, confidence="comunidad"),
        P("metagross", "Lum Berry", "Clear Body", moves=["Bullet Punch", "Rock Slide", "Hammer Arm", "Psych Up"],
          level=50, confidence="comunidad"),
    ],
    2009: [
        P("empoleon", "Wacan Berry", "Torrent", "Modest", [68, 0, 12, 252, 4, 172],
          moves=["Surf", "Hydro Pump", "Icy Wind", "Protect"], level=50),
        P("toxicroak", "Focus Sash", "Dry Skin", "Adamant", [0, 252, 4, 0, 0, 252],
          moves=["Cross Chop", "Sucker Punch", "Fake Out", "Taunt"], level=50),
        P("salamence", "Sitrus Berry", "Intimidate", "Modest", [20, 0, 0, 236, 0, 252],
          moves=["Protect", "Draco Meteor", "Flamethrower", "Rain Dance"], level=50),
        P("snorlax", "Chilan Berry", "Thick Fat", "Adamant", [204, 52, 156, 0, 60, 36],
          moves=["Return", "Earthquake", "Self-Destruct", "Protect"], level=50),
        P("ludicolo", "Lum Berry", "Swift Swim", "Calm", [28, 0, 4, 220, 76, 180],
          moves=["Hydro Pump", "Grass Knot", "Fake Out", "Rain Dance"], level=50),
        P("metagross", "Choice Scarf", "Clear Body", "Jolly", [4, 252, 0, 0, 0, 252],
          moves=["Meteor Mash", "Rock Slide", "Explosion", "Trick"], level=50),
    ],
    2010: [
        P("ludicolo", "Leftovers", "Swift Swim", "Modest", [172, 0, 0, 252, 84, 0],
          moves=["Grass Knot", "Leech Seed", "Substitute", "Protect"], level=50),
        P("cresselia", "Sitrus Berry", "Levitate", "Sassy", [252, 0, 4, 0, 252, 0],
          moves=["Trick Room", "Helping Hand", "Psychic", "Light Screen"], level=50),
        P("hariyama", "Flame Orb", "Guts", "Brave", [4, 252, 0, 0, 252, 0],
          moves=["Protect", "Low Kick", "Fake Out", "Rock Slide"], level=50),
        P("dialga", "Expert Belt", "Pressure", "Quiet", [252, 0, 0, 252, 4, 0],
          moves=["Trick Room", "Thunder", "Dragon Pulse", "Flamethrower"], level=50),
        P("groudon", "Iron Ball", "Drought", "Brave", [220, 252, 0, 0, 36, 0],
          moves=["Earthquake", "Rock Slide", "Protect", "Fling"], level=50,
          note="Bola Férrea reduce su Velocidad para aprovechar Espacio Raro."),
        P("kyogre", "Macho Brace", "Drizzle", "Quiet", [236, 0, 20, 252, 0, 0],
          moves=["Thunder", "Ice Beam", "Protect", "Water Spout"], level=50,
          note="Brazal Firme (Macho Brace) para jugar bajo Espacio Raro."),
    ],
    2011: [
        P("gothitelle", "Sitrus Berry", "Shadow Tag", "Sassy", [220, 0, 168, 44, 76, 0],
          moves=["Trick Room", "Psychic", "Hidden Power [Ice]", "Protect"], level=50),
        P("escavalier", "Choice Band", "Swarm", "Brave", [236, 236, 0, 0, 36, 0],
          moves=["Megahorn", "Aerial Ace", "Iron Head", "Return"], level=50),
        P("hydreigon", "Haban Berry", "Levitate", "Modest", [244, 0, 4, 132, 12, 116],
          moves=["Draco Meteor", "Dark Pulse", "Flamethrower", "Protect"], level=50),
        P("conkeldurr", "Leftovers", "Guts", "Adamant", [252, 12, 8, 0, 232, 4],
          moves=["Drain Punch", "Rock Slide", "Protect", "Superpower"], level=50),
        P("terrakion", "Choice Scarf", "Justified", "Jolly", [20, 212, 12, 0, 12, 252],
          moves=["Close Combat", "Rock Slide", "Safeguard", "Protect"], level=50,
          note="Set reportado por el propio Ray Rizzo; Velo Sagrado y Protección con Pañuelo Elegido."),
        P("thundurus", "Charti Berry", "Prankster", "Bold", [244, 0, 160, 20, 80, 4],
          moves=["Thunderbolt", "Thunder Wave", "Taunt", "Hidden Power [Ice]"], level=50),
    ],
    2013: [
        P("mamoswine", "Choice Scarf", "Thick Fat", "Adamant", [124, 44, 100, 0, 44, 196],
          [31, 31, 31, 1, 31, 31], ["Icicle Spear", "Earthquake", "Icicle Crash", "Rock Slide"], 50),
        P("tornadus", "Flying Gem", "Defiant", "Jolly", [4, 252, 0, 0, 0, 252],
          [31, 31, 31, 3, 31, 31], ["Acrobatics", "Protect", "Superpower", "U-turn"], 50),
        P("latios", "Dragon Gem", "Levitate", "Timid", [4, 0, 0, 252, 0, 252],
          [31, 2, 31, 30, 31, 30], ["Sunny Day", "Draco Meteor", "Protect", "Hidden Power [Fire]"], 50),
        P("amoonguss", "Lum Berry", "Regenerator", "Calm", [252, 0, 108, 0, 148, 0],
          [31, 0, 31, 31, 31, 7], ["Spore", "Rage Powder", "Giga Drain", "Protect"], 50),
        P("heatran", "Leftovers", "Flash Fire", "Timid", [212, 0, 4, 36, 4, 252],
          [31, 0, 31, 31, 31, 31], ["Substitute", "Heat Wave", "Protect", "Earth Power"], 50),
        P("conkeldurr", "Sitrus Berry", "Iron Fist", "Adamant", [212, 32, 12, 0, 252, 0],
          [31, 31, 31, 0, 31, 31], ["Drain Punch", "Ice Punch", "Mach Punch", "Protect"], 50),
    ],
    2022: [
        P("gastrodon", "Leftovers", "Storm Drain", moves=["Earth Power", "Icy Wind", "Yawn", "Protect"],
          confidence="oficial"),
        P("calyrex-shadow", "Focus Sash", "As One", moves=["Astral Barrage", "Snarl", "Will-O-Wisp", "Protect"],
          confidence="oficial"),
        P("rillaboom", "Assault Vest", "Grassy Surge", moves=["Grassy Glide", "Fake Out", "Knock Off", "High Horsepower"],
          confidence="oficial"),
        P("incineroar", "Safety Goggles", "Intimidate", moves=["Flare Blitz", "Parting Shot", "Fake Out", "Throat Chop"],
          confidence="oficial"),
        P("thundurus", "Life Orb", "Defiant", moves=["Wild Charge", "Taunt", "Fly", "Protect"],
          confidence="oficial"),
        P("zacian", "Rusted Sword", "Intrepid Sword", moves=["Iron Head", "Sacred Sword", "Substitute", "Protect"],
          confidence="oficial"),
    ],
}

SOURCES = {
    "limitless": lambda tid: {"label": "Limitless VGC · equipos del torneo", "url": f"https://limitlessvgc.com/tournaments/{tid}/teams"},
    "limitless_results": lambda tid: {"label": "Limitless VGC · clasificación", "url": f"https://limitlessvgc.com/tournaments/{tid}"},
    "bulbapedia": {"label": "Bulbapedia · World Championships", "url": "https://bulbapedia.bulbagarden.net/wiki/World_Championships"},
    "pokemaster": lambda year: {"label": f"Pokémaster · equipo del campeón {year}", "url": f"https://pokemaster.es/competitivo/vgc/pokemons-destacados-vgc/vgc-{year}/equipo-del-campeon-mundial"},
    "hamsmogon": lambda slug: {"label": "Hamsmogon · Paseo por la historia del VGC", "url": slug},
    "official2022": {"label": "Pokémon.com · resultados VGC Masters 2022", "url": "https://www.pokemon.com/us/play-pokemon/worlds/2022/vgc-masters"},
    "nugget2013": {"label": "Nugget Bridge · report de Arash Ommati (2013)", "url": "https://nuggetbridge.com/reports/mean-streets-world-champion-masters-2013-vgc-world-champion-report/"},
    "forum2008": {"label": "Legendary Pokémon · equipo de Izuru Yoshimura (2008)", "url": "https://legendarypkmn.net/forums/archive/thread-943.html"},
}

META = {
    2008: dict(
        champion="Izuru Yoshimura", country="JP", finalist="Yasuhito Kajiwara", finalistCountry="JP",
        location="Orlando, Florida (EE. UU.)", date="15–17 de agosto de 2008",
        games="Diamante / Perla / Platino", regulation="VGS 2008", format="Dobles 4v4 · Nivel 50",
        summary="El primer campeón mundial de la era moderna ganó con un equipo de Espacio Raro construido alrededor de un Smeargle de nivel 1, un Snorlax con Tambor y un Metagross con Autosugestión.",
        sources=[SOURCES["forum2008"], SOURCES["bulbapedia"]],
        limitless=None,
    ),
    2009: dict(
        champion="Kazuyuki Tsuji", country="JP", finalist="Tasuku Mano", finalistCountry="JP",
        location="San Diego, California (EE. UU.)", date="14–15 de agosto de 2009",
        games="Platino", regulation="VGC 2009", format="Dobles 4v4 · Nivel 50",
        summary="Kazuyuki Tsuji se llevó el título con un equipo de lluvia muy ofensivo en el que convivían Empoleon, Ludicolo, Toxicroak, Salamence, Snorlax y Metagross.",
        sources=[SOURCES["hamsmogon"]("https://hamsmogonblog.wordpress.com/2015/06/24/paseo-por-la-historia-del-vgc-2009/"), SOURCES["bulbapedia"]],
        limitless=50,
    ),
    2010: dict(
        champion="Ray Rizzo", country="US", finalist="Yasuki Tochigi", finalistCountry="JP",
        location="Waikoloa, Hawái (EE. UU.)", date="13–15 de agosto de 2010",
        games="HeartGold / SoulSilver", regulation="VGC 2010 · GS Cup", format="Dobles 4v4 · 2 restringidos",
        summary="El primero de los tres títulos consecutivos de Ray Rizzo: un equipo de Espacio Raro con Kyogre y Groudon lastrados por objetos que reducen su Velocidad.",
        sources=[SOURCES["pokemaster"](2010), SOURCES["bulbapedia"]],
        limitless=49,
    ),
    2011: dict(
        champion="Ray Rizzo", country="US", finalist="Matteo Gini", finalistCountry="IT",
        location="San Diego, California (EE. UU.)", date="12–14 de agosto de 2011",
        games="Negro / Blanco", regulation="VGC 2011", format="Dobles 4v4 · Pokédex de Teselia",
        summary="Ray Rizzo revalidó el título con un equipo defensivo y poco convencional, con Gothitelle, Escavalier y un Thundurus bulky de Baya Alcho que marcó época.",
        sources=[SOURCES["pokemaster"](2011), SOURCES["bulbapedia"]],
        limitless=50,
    ),
    2012: dict(
        champion="Ray Rizzo", country="US", finalist="Wolfe Glick", finalistCountry="US",
        location="Waikoloa, Hawái (EE. UU.)", date="13–15 de agosto de 2012",
        games="Negro 2 / Blanco 2", regulation="VGC 2012", format="Dobles 4v4 · Pokédex Nacional",
        summary="Tercer título consecutivo de Ray Rizzo, esta vez con un equipo de buenstuff liderado por Cresselia, Metagross, Hydreigon, Garchomp, Tyranitar y Rotom-Wash.",
        sources=[SOURCES["limitless"](51), SOURCES["limitless_results"](51), SOURCES["bulbapedia"]],
        limitless=51,
    ),
    2013: dict(
        champion="Arash Ommati", country="IT", finalist="Ryosuke Kosuge", finalistCountry="JP",
        location="Vancouver, Columbia Británica (Canadá)", date="9–11 de agosto de 2013",
        games="Negro 2 / Blanco 2", regulation="VGC 2013", format="Dobles 4v4 · Pokédex Nacional",
        summary="Arash Ommati se convirtió en el primer campeón mundial europeo con un Mamoswine de Pañuelo Elegido como antídoto contra los genios y un equipo muy equilibrado.",
        sources=[SOURCES["nugget2013"], SOURCES["limitless"](52), SOURCES["bulbapedia"]],
        limitless=52,
    ),
    2014: dict(
        champion="Se Jun Park", country="KR", finalist="Jeudy Azzarelli", finalistCountry="US",
        location="Washington D. C. (EE. UU.)", date="15–17 de agosto de 2014",
        games="X / Y", regulation="VGC 2014", format="Dobles 4v4 · Pokédex de Kalos",
        summary="Se Jun Park hizo historia con Pachirisu, un Pokémon que nadie esperaba, junto a Gothitelle, Gardevoir, Mega Gyarados, Talonflame y Garchomp.",
        sources=[SOURCES["limitless"](53), SOURCES["limitless_results"](53), SOURCES["bulbapedia"]],
        limitless=53,
    ),
    2015: dict(
        champion="Shoma Honami", country="JP", finalist="Hideyuki Taida", finalistCountry="JP",
        location="Boston, Massachusetts (EE. UU.)", date="21–23 de agosto de 2015",
        games="Rubí Omega / Zafiro Alfa", regulation="VGC 2015", format="Dobles 4v4 · Pokédex Nacional",
        summary="Shoma Honami ganó con Mega Kangaskhan, Heatran, Thundurus, Landorus-T, Cresselia y Amoonguss, un equipo sólido que dominó el formato de Kalos.",
        sources=[SOURCES["limitless"](47), SOURCES["limitless_results"](47), SOURCES["bulbapedia"]],
        limitless=47,
    ),
    2016: dict(
        champion="Wolfe Glick", country="US", finalist="Jonathan Evans", finalistCountry="US",
        location="San Francisco, California (EE. UU.)", date="19–21 de agosto de 2016",
        games="Rubí Omega / Zafiro Alfa", regulation="VGC 2016 · GS Cup", format="Dobles 4v4 · 2 restringidos",
        summary="Wolfe Glick conquistó su primer Mundial con Mega Rayquaza y Kyogre Primigenio, acompañados por Mega Gengar, Hitmontop, Raichu y Bronzong.",
        sources=[SOURCES["limitless"](46), SOURCES["limitless_results"](46), SOURCES["bulbapedia"]],
        limitless=46,
    ),
    2017: dict(
        champion="Ryota Otsubo", country="JP", finalist="Sam Pandelis", finalistCountry="AU",
        location="Anaheim, California (EE. UU.)", date="18–20 de agosto de 2017",
        games="Sol / Luna", regulation="VGC 2017", format="Dobles 4v4 · Pokédex de Alola",
        summary="Ryota Otsubo se coronó con Krookodile, Whimsicott, Tapu Fini, Marowak de Alola, Celesteela y Tapu Koko en el primer Mundial de la generación 7.",
        sources=[SOURCES["limitless"](31), SOURCES["limitless_results"](31), SOURCES["bulbapedia"]],
        limitless=31,
    ),
    2018: dict(
        champion="Paul Ruiz", country="EC", finalist="Emilio Forbes", finalistCountry="US",
        location="Nashville, Tennessee (EE. UU.)", date="24–26 de agosto de 2018",
        games="Ultrason / Ultraluna", regulation="VGC 2018", format="Dobles 4v4 · Pokédex Nacional",
        summary="Paul Ruiz ganó con Tapu Koko, Mega Salamence, Snorlax, Incineroar, Gastrodon y Kartana, un equipo que combinaba presión y control del terreno.",
        sources=[SOURCES["limitless"](194), SOURCES["limitless_results"](194), SOURCES["bulbapedia"]],
        limitless=194,
    ),
    2019: dict(
        champion="Naoto Mizobuchi", country="JP", finalist="Hirofumi Kimura", finalistCountry="JP",
        location="Washington D. C. (EE. UU.)", date="16–18 de agosto de 2019",
        games="Ultrason / Ultraluna", regulation="VGC 2019 · GS Cup", format="Dobles 4v4 · 2 restringidos",
        summary="Naoto Mizobuchi se llevó el último Mundial de la generación 7 con Lunala, Groudon Primigenio, Incineroar, Mega Salamence, Tapu Fini y Stakataka.",
        sources=[SOURCES["limitless"](201), SOURCES["limitless_results"](201), SOURCES["bulbapedia"]],
        limitless=201,
    ),
    2022: dict(
        champion="Eduardo Cunha", country="PT", finalist="Guillermo Castilla", finalistCountry="ES",
        location="Londres (Reino Unido)", date="18–21 de agosto de 2022",
        games="Espada / Escudo", regulation="Serie 12 · GS Cup", format="Dobles 4v4 · 2 restringidos",
        summary="Eduardo Cunha ganó el Mundial de regreso con Zacian, Calyrex Jinete Espectral, Incineroar, Gastrodon, Rillaboom y Thundurus, sin perder ninguna serie.",
        sources=[SOURCES["official2022"], SOURCES["bulbapedia"]],
        limitless=294,
    ),
    2023: dict(
        champion="Shohei Kimura", country="JP", finalist="Michael Kelsch", finalistCountry="DE",
        location="Yokohama (Japón)", date="11–13 de agosto de 2023",
        games="Escarlata / Púrpura", regulation="Regulación D", format="Dobles 4v4",
        summary="Shohei Kimura inauguró la era de Escarlata y Púrpura con Landorus-T, Urshifu Golpe Fluido, Flutter Mane, Chien-Pao, Amoonguss e Iron Hands.",
        sources=[SOURCES["limitless"](319), SOURCES["limitless_results"](319), SOURCES["bulbapedia"]],
        limitless=319,
    ),
    2024: dict(
        champion="Luca Ceribelli", country="IT", finalist="Yuta Ishigaki", finalistCountry="JP",
        location="Honolulu, Hawái (EE. UU.)", date="16–18 de agosto de 2024",
        games="Escarlata / Púrpura", regulation="Regulación G", format="Dobles 4v4 · 1 restringido",
        summary="Luca Ceribelli ganó con Miraidon, Ogerpon Máscara Horno, Urshifu Golpe Fluido, Iron Hands, Whimsicott y Farigiraf en el primer Mundial con un restringido por equipo.",
        sources=[SOURCES["limitless"](358), SOURCES["limitless_results"](358), SOURCES["bulbapedia"]],
        limitless=358,
    ),
    2025: dict(
        champion="Giovanni Cischke", country="US", finalist="James Evans", finalistCountry="US",
        location="Anaheim, California (EE. UU.)", date="15–17 de agosto de 2025",
        games="Escarlata / Púrpura", regulation="Regulación I", format="Dobles 4v4 · 1 restringido",
        summary="Giovanni Cischke se coronó con Brute Bonnet, Lunala, Ursaluna, Chi-Yu, Koraidon y Flutter Mane, un equipo con múltiples formas de presión ofensiva.",
        sources=[SOURCES["limitless"](399), SOURCES["limitless_results"](399), SOURCES["bulbapedia"]],
        limitless=399,
    ),
    2026: dict(
        champion="Takuma Yamazaki", country="JP", finalist="Hiroshi Onishi", finalistCountry="JP",
        location="San Francisco, California (EE. UU.)", date="28–30 de agosto de 2026",
        games="Regulación M-B · Mega Evolución", regulation="Regulación M-B", format="Dobles 4v4",
        summary="Takuma Yamazaki se proclamó campeón en San Francisco con Mega Floette, Basculegion, Kingambit, Mega Dragonite, Garchomp y Sneasler.",
        sources=[SOURCES["limitless"](437), SOURCES["limitless_results"](437), SOURCES["bulbapedia"]],
        limitless=437,
    ),
}

COUNTRY_ES = {
    "JP": "Japón", "US": "Estados Unidos", "IT": "Italia", "KR": "Corea del Sur",
    "EC": "Ecuador", "PT": "Portugal", "ES": "España", "AU": "Australia",
    "DE": "Alemania", "GB": "Reino Unido", "FR": "Francia", "CA": "Canadá",
    "BR": "Brasil", "SE": "Suecia", "MX": "México", "AR": "Argentina",
}


def display_name(slug, species_es):
    if slug == "floette-mega":
        return "Mega Floette (Flor Eterna)"
    if slug.endswith("-mega-x"):
        return f"Mega {species_es} X"
    if slug.endswith("-mega-y"):
        return f"Mega {species_es} Y"
    if slug.endswith("-mega"):
        return f"Mega {species_es}"
    if slug.endswith("-primal"):
        return f"Primigenio {species_es}"
    special = {
        "rotom-wash": "Rotom (Lavado)",
        "landorus-therian": "Landorus (Forma Tótem)",
        "marowak-alola": "Marowak de Alola",
        "urshifu-rapid-strike": "Urshifu (Golpe Fluido)",
        "ogerpon-hearthflame-mask": "Ogerpon (Máscara Horno)",
        "floette-eternal": "Floette (Flor Eterna)",
        "calyrex-shadow": "Calyrex (Jinete Espectral)",
        "calyrex-ice": "Calyrex (Jinete Glacial)",
    }
    return special.get(slug, species_es)


def get_move(name):
    original = MOVE_FIX.get(html.unescape(name), html.unescape(name))
    override = None
    m = re.search(r"\[(.*?)\]", original)
    if m:
        override = m.group(1).strip().lower()
        original = re.sub(r"\s*\[.*?\]", "", original).strip()
    slug = move_slug(original)
    try:
        d = fetch_json(f"https://pokeapi.co/api/v2/move/{slug}")
    except Exception:  # noqa: BLE001
        return {"en": original, "es": original, "typeKey": override or "unknown",
                "type": TYPE_ES.get(override or "unknown", "Desconocido"), "category": "—",
                "power": None, "accuracy": None, "pp": None, "effect": ""}
    type_key = override or d["type"]["name"]
    es = es_name(d, original)
    if override:
        es = f"{es} [{TYPE_ES.get(override, override.title())}]"
    return {
        "en": original,
        "es": es,
        "typeKey": type_key,
        "type": TYPE_ES.get(type_key, type_key.title()),
        "category": CATEGORY_ES.get(d["damage_class"]["name"], d["damage_class"]["name"]),
        "power": d.get("power"),
        "accuracy": d.get("accuracy"),
        "pp": d.get("pp"),
        "effect": es_effect(d),
    }


def get_ability(name):
    if not name:
        return {"en": None, "es": None, "effect": ""}
    slug = ABILITY_FIX.get(name) or ability_slug(name)
    try:
        d = fetch_json(f"https://pokeapi.co/api/v2/ability/{slug}")
    except Exception:  # noqa: BLE001
        return {"en": name, "es": name, "effect": ""}
    return {"en": name, "es": es_name(d, name), "effect": es_effect(d)}


def get_item(name):
    if not name:
        return {"en": None, "es": None, "sprite": None, "effect": ""}
    slug = item_slug(name)
    try:
        d = fetch_json(f"https://pokeapi.co/api/v2/item/{slug}")
    except Exception:  # noqa: BLE001
        return {"en": name, "es": name, "sprite": None, "effect": ""}
    return {"en": name, "es": es_name(d, name), "sprite": d["sprites"].get("default"), "effect": es_effect(d)}


def enrich(p):
    slug = SLUG_FIX.get(p["slug"], p["slug"])
    if p.get("item") == "Dragoninite" and slug == "dragonite":
        slug = "dragonite-mega"
    if p.get("item") == "Floettite" and slug == "floette-eternal":
        slug = "floette-mega"
    try:
        poke = fetch_json(f"https://pokeapi.co/api/v2/pokemon/{slug}")
    except Exception:  # noqa: BLE001
        base = slug.split("-")[0]
        poke = fetch_json(f"https://pokeapi.co/api/v2/pokemon/{base}")
    species = fetch_json(poke["species"]["url"])
    species_es = es_name(species, poke["name"].replace("-", " ").title())
    stats = {}
    for s in poke["stats"]:
        key = {"hp": "hp", "attack": "atk", "defense": "def", "special-attack": "spa",
               "special-defense": "spd", "speed": "spe"}[s["stat"]["name"]]
        stats[key] = s["base_stat"]
    art = poke["sprites"]["other"].get("official-artwork", {}).get("front_default")
    home = poke["sprites"]["other"].get("home", {}).get("front_default")
    sprite = art or home or poke["sprites"].get("front_default")
    return {
        "key": slug,
        "species": species["name"],
        "displayName": display_name(slug, species_es),
        "sprite": sprite,
        "types": [TYPE_ES.get(t["type"]["name"], t["type"]["name"]) for t in poke["types"]],
        "typeKeys": [t["type"]["name"] for t in poke["types"]],
        "baseStats": stats,
        "item": get_item(p.get("item")),
        "ability": get_ability(p.get("ability")),
        "nature": p.get("nature"),
        "natureEs": NATURE_ES.get(p.get("nature"), p.get("nature")),
        "evs": p.get("evs"),
        "ivs": p.get("ivs"),
        "level": p.get("level"),
        "teraType": p.get("teraType"),
        "moves": [get_move(m) for m in p.get("moves", [])],
        "confidence": p.get("confidence", "report"),
        "note": p.get("note"),
    }


def from_limitless(p, year):
    slug = SLUG_FIX.get(p["speciesId"], p["speciesId"])
    item = p.get("item")
    if item == "Dragoninite" and slug == "dragonite":
        slug = "dragonite-mega"
    if item == "Floettite" and slug == "floette-eternal":
        slug = "floette-mega"
    return P(
        slug, item, p.get("ability"), p.get("nature"), p.get("evs"), p.get("ivs"),
        p.get("moves") or [], None,
        "oficial" if year >= 2023 else "report",
        None, p.get("teraType"),
    )


def main():
    limitless = json.loads((DATA / "champions-limitless.json").read_text(encoding="utf-8"))
    by_year = {t["year"]: t for t in limitless}
    champions = []
    for year in sorted(META):
        meta = META[year]
        if year in MANUAL_TEAMS:
            team = MANUAL_TEAMS[year]
        else:
            team = [from_limitless(p, year) for p in by_year[year]["team"]]
        print(f"Enriqueciendo {year} ({len(team)} Pokémon)...")
        champions.append({
            "year": year,
            "champion": meta["champion"],
            "country": meta["country"],
            "countryName": COUNTRY_ES.get(meta["country"], meta["country"]),
            "flag": FLAG(meta["country"]),
            "finalist": meta["finalist"],
            "finalistCountry": meta["finalistCountry"],
            "finalistCountryName": COUNTRY_ES.get(meta["finalistCountry"], meta["finalistCountry"]),
            "finalistFlag": FLAG(meta["finalistCountry"]),
            "location": meta["location"],
            "date": meta["date"],
            "games": meta["games"],
            "regulation": meta["regulation"],
            "format": meta["format"],
            "summary": meta["summary"],
            "sources": meta["sources"],
            "team": [enrich(p) for p in team],
        })
    for year in (2020, 2021):
        champions.append({
            "year": year, "cancelled": True, "champion": None, "country": None,
            "countryName": None, "flag": "", "finalist": None, "finalistCountry": None,
            "finalistCountryName": None, "finalistFlag": "", "location": "—",
            "date": f"Edición {year}", "games": "—", "regulation": "—", "format": "—",
            "summary": "Edición cancelada por la pandemia de COVID-19.",
            "sources": [SOURCES["bulbapedia"]], "team": [],
        })
    champions.sort(key=lambda c: c["year"])
    (DATA / "champions.json").write_text(json.dumps(champions, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"champions.json: {len(champions)} entradas")

    # PokeAlex
    alex_teams = {
        "worlds2019": ["kyogre-primal", "rayquaza-mega", "incineroar", "tapu-koko", "nihilego", "kartana"],
        "naic2023": ["dragapult", "chien-pao", "iron-hands", "dondozo", "ting-lu", "flutter-mane"],
        "euic2024": ["rillaboom", "incineroar", "urshifu-rapid-strike", "raging-bolt", "chien-pao", "gholdengo"],
        "worlds2024": ["grimmsnarl", "landorus", "urshifu-rapid-strike", "ogerpon-hearthflame-mask", "raging-bolt", "terapagos"],
        "naic2026": ["garchomp", "sylveon", "farigiraf", "aerodactyl-mega", "kingambit", "charizard-mega-y"],
    }
    alex = {
        "name": "Alex Gómez Berna",
        "alias": "PokeAlex",
        "country": "ES",
        "countryName": "España",
        "flag": FLAG("ES"),
        "born": "12 de enero de 1999",
        "team": "Movistar KOI",
        "since": "2024",
        "role": "Jugador de VGC · Creador de contenido · Coach",
        "bio": "Jugador español de Pokémon VGC, tres veces Top 8 del Mundo y campeón internacional de Norteamérica en 2023. Compite para Movistar KOI y comparte su experiencia en pokealex.es.",
        "links": [
            {"label": "Web oficial", "url": "https://www.pokealex.es/"},
            {"label": "X / Twitter", "url": "https://x.com/pokealexvgc"},
            {"label": "Twitch", "url": "https://www.twitch.tv/pokealex"},
            {"label": "Liquipedia", "url": "https://liquipedia.net/pokemon/Alex_G%C3%B3mez"},
        ],
        "stats": [
            {"label": "Top 8 mundiales", "value": "3", "detail": "2013 · 2014 · 2019"},
            {"label": "Títulos internacionales", "value": "1", "detail": "NAIC 2023"},
            {"label": "Títulos nacionales", "value": "1", "detail": "Reino Unido 2016"},
            {"label": "Títulos regionales", "value": "1", "detail": "Francia 2015"},
            {"label": "Top cuts internacionales", "value": "6", "detail": "1º · 2º · Top 4 · 3 Top 8"},
            {"label": "Top cuts regionales", "value": "7", "detail": "2 subcampeonatos · 3 Top 4 · 2 Top 8"},
            {"label": "Prize money", "value": "$48.500", "detail": "Limitless VGC (jun. 2026)"},
            {"label": "Puntos de campeonato", "value": "629", "detail": "Limitless VGC (jun. 2026)"},
        ],
        "milestones": [
            {"year": "2009", "title": "Inicios competitivos", "text": "Empieza a jugar a Pokémon competitivo en los foros Ranking Hispano y PokeSpain.", "tier": "inicio"},
            {"year": "2011", "title": "Top 4 en el Nacional de España", "text": "Debuta en un torneo oficial con un Top 4 en Madrid.", "tier": "nacional"},
            {"year": "2012", "title": "Top 4 en el Nacional de Francia", "text": "Consigue plaza para el Mundial de Hawái.", "tier": "nacional"},
            {"year": "2013", "title": "Top 8 del Mundo", "text": "Primer Top 8 mundial en Vancouver.", "tier": "mundial"},
            {"year": "2014", "title": "Top 8 del Mundo", "text": "Repite Top 8 en Washington D. C.", "tier": "mundial"},
            {"year": "2015", "title": "Campeón Regional de Francia", "text": "Primer título regional en Lyon.", "tier": "regional"},
            {"year": "2016", "title": "Campeón Nacional del Reino Unido", "text": "Gana el Nacional británico y lidera el ranking mundial con 1191 CP.", "tier": "nacional"},
            {"year": "2017", "title": "Subcampeón de Europa", "text": "Finalista del EUIC de Londres ante Simone Sanvito.", "tier": "internacional"},
            {"year": "2018", "title": "Top 4 en Leipzig y Top 8 en LAIC", "text": "Consolida su presencia en el circuito internacional.", "tier": "internacional"},
            {"year": "2019", "title": "6º del Mundo", "text": "Top 8 en el Mundial de Washington D. C. con Kyogre Primigenio y Mega Rayquaza. También fue subcampeón del Regional de Bolzano.", "tier": "mundial"},
            {"year": "2020", "title": "Subcampeón en Colonia", "text": "Finalista del Regional de Colonia y Top 4 en Malmö.", "tier": "regional"},
            {"year": "2022", "title": "Pausa competitiva", "text": "Anuncia una retirada temporal del circuito; regresa en 2023.", "tier": "inicio"},
            {"year": "2023", "title": "Campeón del NAIC", "text": "Gana el Internacional de Norteamérica en Columbus con Dragapult, Chien-Pao, Iron Hands, Dondozo, Ting-Lu y Flutter Mane. Además, 6º en el Regional de Barcelona.", "tier": "internacional"},
            {"year": "2024", "title": "Top 4 en el EUIC", "text": "Semifinalista del Europeo de Londres, 7º en el LAIC y 29º en el Mundial de Honolulu. Se une a Movistar KOI.", "tier": "internacional"},
            {"year": "2025", "title": "Top 4 en Birmingham", "text": "Semifinalista del Regional de Birmingham, 9º en Stuttgart y 25º en el NAIC.", "tier": "regional"},
            {"year": "2026", "title": "10º en el EUIC y 14º en el NAIC", "text": "Suma un top 10 en el Europeo y un 14º puesto en el Internacional de Norteamérica.", "tier": "internacional"},
        ],
        "teams": [],
    }
    for key, slugs in alex_teams.items():
        alex["teams"].append({"key": key, "pokemon": [enrich(P(s, confidence="report")) for s in slugs]})
    (DATA / "pokealex.json").write_text(json.dumps(alex, ensure_ascii=False, indent=2), encoding="utf-8")
    print("pokealex.json generado")


if __name__ == "__main__":
    main()
