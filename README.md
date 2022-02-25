# NFT Rarity Calculator

Can be used to see the rarity scores of each item in an NFT collection. Mathematics based on [rarity.tools](https://rarity.tools) scoring.

## Requirements

The project will output an ordered list of each edition with corresponding rarity score. The output file will be `rarity_scores.json`.

You will need to place a `metadata_list.json` file in the directory, which is an array of all metadata for the project.

Built using Node.js 16 with Yarn

Install dependencies before running:

```yarn install```

## Running the project

Once everything is ready to go run the following:

```node index.js```

Inspect your `rarity_scores.json` file to see the results! Enjoy!

## Future plans

* Add web3 support to scrape metadata from blockchain (no list required)
* Tooling to see more information about trait distribution within a collection

## Contribute

You can find me at jabeo.eth