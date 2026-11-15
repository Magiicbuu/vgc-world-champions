"""Scrape the champion team of each Pokémon VGC World Championship from Limitless VGC.

Generates src/data/champions-limitless.json with the 1st place team of every
World Championship available on Limitless (2012, 2014-2019, 2023-2026).
Data is used as a base and later enriched/curated by hand.
"""

from __future__ import annotations

import json
import re
import urllib.request
from pathlib import Path

TOURNAMENTS = [
    (2012, 51),
    (2014, 53),
    (2015, 47),
    (2016, 46),
    (2017, 31),
    (2018, 194),
    (2019, 201),
    (2023, 319),
    (2024, 358),
    (2025, 399),
    (2026, 437),
]

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src" / "data" / "champions-limitless.json"


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as response:
        return response.read().decode("utf-8", "replace")


def parse_evs(raw: str | None) -> list[int] | None:
    if not raw:
        return None
    numbers = [int(n) for n in re.findall(r"\d+", raw)]
    return numbers[:6] if len(numbers) >= 6 else None


def parse_team(block: str) -> list[dict]:
    mons: list[dict] = []
    matches = re.finditer(
        r'<div class="pkmn" data-id="([^"]+)">(.*?)(?=<div class="pkmn"|$)',
        block,
        re.S,
    )
    for match in matches:
        pid, body = match.group(1), match.group(2)
        name = re.search(r'<div class="name">\s*<a[^>]*>([^<]+)</a>', body)
        sprite = re.search(r'<div class="image">\s*<img src="([^"]+)"', body)
        item_sprite = re.search(r'<img class="item" src="([^"]+)"', body)
        item = re.search(r'<div class="item">([^<]+)</div>', body)
        ability = re.search(r'<div class="ability">Ability:\s*([^<]+)</div>', body)
        nature = re.search(r'<div class="nature">([^<]+)</div>', body)
        tera = re.search(r'<div class="tera">Tera Type:\s*([^<]+)</div>', body)
        evs = re.search(r'data-evs="([^"]+)"', body)
        ivs = re.search(r'data-ivs="([^"]+)"', body)
        moves = re.findall(r"<li>([^<]+)</li>", body)
        mons.append(
            {
                "speciesId": pid,
                "name": name.group(1).strip() if name else pid,
                "sprite": sprite.group(1) if sprite else None,
                "item": item.group(1).strip() if item else None,
                "itemSprite": item_sprite.group(1) if item_sprite else None,
                "ability": ability.group(1).strip() if ability else None,
                "nature": nature.group(1).replace("Nature", "").strip() if nature else None,
                "teraType": tera.group(1).strip() if tera else None,
                "evs": parse_evs(evs.group(1)) if evs else None,
                "ivs": ivs.group(1).strip() if ivs else None,
                "moves": [m.strip() for m in moves][:4],
            }
        )
    return mons


def main() -> None:
    results = []
    for year, tournament_id in TOURNAMENTS:
        url = f"https://limitlessvgc.com/tournaments/{tournament_id}/teams"
        html = fetch(url)
        chunks = re.split(r'<div class="teamlist-toggle"', html)[1:]
        if not chunks:
            print(f"{year}: no teams")
            continue
        first = chunks[0]
        label = re.match(r'[^>]*>([^<]+)</div>', first)
        placement_name = label.group(1).strip() if label else ""
        mons = parse_team(first)
        results.append(
            {
                "year": year,
                "placement": placement_name,
                "team": mons,
                "source": url,
            }
        )
        print(f"{year}: {placement_name} ({len(mons)} Pokémon)")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nWrote {OUT}")


if __name__ == "__main__":
    main()
