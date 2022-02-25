const fs =  require('fs');
const _ = require('lodash');

const METADATA_LIST_PATH = 'metadata_list.json'

/**
 *  CALCULATION METHOD FROM: https://raritytools.medium.com/ranking-rarity-understanding-rarity-calculation-methods-86ceaeb9b98c
 * 
 *  [Rarity Score for a Trait Value] = 1 / ([Number of Items with that Trait Value] / [Total Number of Items in Collection])
 * 
 *  The total Rarity Score for an NFT is the sum of the Rarity Score of all of it’s trait values.
 */

function calculateRarity() {
    const metadataList = JSON.parse(fs.readFileSync(METADATA_LIST_PATH));

    let traitsAndValuesWithCounts = {};
    let itemsWithRarities = [];

    for (let { attributes } of metadataList) {
        for (let { trait_type, value } of attributes) {
            let currentValue = _.get(traitsAndValuesWithCounts, `${trait_type}.${value}`, 0);
            _.set(traitsAndValuesWithCounts, `${trait_type}.${value}`, currentValue + 1);
        }
    }

    for (let item of metadataList) {
        let score = 0;
        let attributesWithRarities = []

        for (let { trait_type, value } of item.attributes) {
            const occurence = ((traitsAndValuesWithCounts[trait_type][value] / metadataList.length) * 100).toFixed(2) + '%';
            score += 1 / (traitsAndValuesWithCounts[trait_type][value] / metadataList.length);
            attributesWithRarities.push({ trait_type, value, occurence });
        }

        itemsWithRarities.push({ edition: item.edition, rarity_score: parseFloat(score.toFixed(2)), attributes: attributesWithRarities });
    }

    itemsWithRarities = itemsWithRarities.sort((a, b) => {
        if (a.rarity_score > b.rarity_score)      return -1;
        else if (b.rarity_score > a.rarity_score) return 1;
        else                                      return 0;
    })

    fs.writeFileSync(`rarity_scores.json`, JSON.stringify(itemsWithRarities, null, 4));
}

calculateRarity();