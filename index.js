import { readFileSync, writeFileSync } from 'fs';
import { get, set } from 'lodash';

const METADATA_LIST_PATH = 'metadata_list.json'

/**
 *  CALCULATION METHOD FROM: https://raritytools.medium.com/ranking-rarity-understanding-rarity-calculation-methods-86ceaeb9b98c
 * 
 *  [Rarity Score for a Trait Value] = 1 / ([Number of Items with that Trait Value] / [Total Number of Items in Collection])
 * 
 *  The total Rarity Score for an NFT is the sum of the Rarity Score of all of it’s trait values.
 */

function calculateRarity() {
    const metadataList = JSON.parse(readFileSync(METADATA_LIST_PATH));

    let traitsAndValuesWithCounts = {};
    let itemsWithRarities = [];

    for (let { attributes } of metadataList) {
        for (let { trait_type, value } of attributes) {
            let currentValue = get(traitsAndValuesWithCounts, `${trait_type}.${value}`, 0);
            set(traitsAndValuesWithCounts, `${trait_type}.${value}`, currentValue + 1);
        }
    }

    for (let item of metadataList) {
        let score = 0;

        for (let { trait_type, value } of item.attributes) {
            score += 1 / (traitsAndValuesWithCounts[trait_type][value] / metadataList.length);
        }

        itemsWithRarities.push({ edition: item.edition, rarity_score: parseFloat(score.toFixed(2)) });
    }

    itemsWithRarities = itemsWithRarities.sort((a, b) => {
        if (a.rarity_score > b.rarity_score)      return -1;
        else if (b.rarity_score > a.rarity_score) return 1;
        else                                      return 0;
    })

    writeFileSync(`rarity_scores.json`, JSON.stringify(itemsWithRarities, null, 4));
}

calculateRarity();