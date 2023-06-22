// import { TSMap } from "typescript-map"
import { v4 as uuid } from 'uuid'
import _ from 'lodash';

import { AppDataSource } from "../data-source";
// import { Collectible } from '@src/entity/Collectible';
import { Collection } from '../entity/User';
// import { CollectionCategory } from '@src/entity/CollectionCategory';
// import { CollectionResponse } from '@src/models/response/Collections';
// import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from 'http-status-codes';
// import { noCollectionsError } from '@src/shared/constants';
// import { ApplicationError } from '@src/error/ApplicationError';
import { v4 as uuidv4 } from 'uuid';
const { getCollectibleByCollectionId } = require('../service/Collectibles');



const createCollection = async (collectionData) => {

    //Create collection categories
    const collectionRepo = AppDataSource.getRepository(Collection);
    // const collectionCategoryRepo = AppDataSource.getRepository(CollectionCategory);
    const collection = new Collection();

    try {
        collection.id = uuidv4()
        collection.name = collectionData.name
        collection.description = collectionData.description
        collection.start_date = new Date()
        collection.display_name = collectionData.displayName
        collection.order = collectionData.order
        collection.promotion_video = collectionData.promotionVideo
        collection.long_description = collectionData.longDescription
        collection.placeholder = collectionData.placeholder
        collection.launch_date = collectionData.launchDate;
        //TODO: Need to fix transient save
        // collection.collectionCategoryList = collectionCategoryList;
        await collectionRepo.save(collection);

        const collectionCategoryList = createCollectionCategoryInstances(collectionData, collection.id);
        await collectionCategoryRepo.save(collectionCategoryList);
    } catch (error) {
        console.log(error)
        return { "status": BAD_REQUEST, "data": error.message }
    }
    return { "status": CREATED, "data": { "id": collection.id } }
};

const createCollectionCategoryInstances = (collectionData, collectionId) => {

    const collectionCategoryList: CollectionCategory[] = [];

    collectionData.collectionCategory.forEach(item => {
        const collectionCategory = new CollectionCategory();
        collectionCategory.id = uuidv4();
        collectionCategory.collection_id = collectionId;
        collectionCategory.name = item.name
        collectionCategory.order = item.order
        collectionCategoryList.push(collectionCategory)
    });

    return collectionCategoryList;
};

const getCollectibleListByCollectionCategory = (collectionCategoryId) => {

    return [];
};

const getCategoryList = (collectionCategoryList) => {
    return collectionCategoryList
        .map(collectionCategory => {
            return {
                id: collectionCategory.id,
                name: collectionCategory.name,
                order: collectionCategory.order,
                status: collectionCategory.status,
            };
        });
};

const collectionToDto = async (collection, collectionCollectibleData) => {
    const collectionCategoryList = getCategoryList(await collection.collectionCategoryList);

    const mergedCollectionCategoryList = collectionCategoryList.map((collectionCategory) => {

        const collectibleList = collectionCollectibleData
            .filter((collectible) => collectible.collectionCategoryId === collectionCategory.id)
            .map(collectible => {
                const { id, name, displayName, mediaType, mediaLocation, price, currency, count } = collectible;
                return { id, name, mediaType, displayName, mediaLocation, price, currency, count };
            });

        return { ...collectionCategory, collectibleList };
    });

    return {
        id: collection.id,
        name: collection.name,
        description: collection.description,
        order: collection.order,
        displayName: collection.display_name,
        promotionVideo: collection.promotion_video,
        placeholder: collection.placeholder,
        longDescription: collection.long_description,
        forSale: collection.for_sale,
        launchDate: collection.launch_date,
        categories: mergedCollectionCategoryList

    };
};

const getAllCollections = async () => {

    type collectionCategoryResponseType = {
        id: string,
        name: string,
        order: number,
        title: string,
        description: string,
        longDescription: string,
        displayName: string,
        uploadFile: string,
        
    };

    type collectionResponseType = {
        id: string,
        name: string,
        description: string,
        order: number,
        displayName: string,
        promotionVideo: string,
        longDescription: string,
        placeholder: boolean,
        categories: collectionCategoryResponseType[]
    }

    const collectionRepo = AppDataSource.getRepository(Collection);
    const collectionList = await collectionRepo.findBy({ status: 'ACTIVE' });

    const collectionDtoList = await Promise.all(collectionList.map(async collection => {
        return await collectionToDto(collection, []);
    }));


    return { "status": OK, "data": collectionDtoList };
};

const saveCollectionCollectible = async (collectionCollectible) => {
    await AppDataSource.manager.save(collectionCollectible);
};

export = {
    getAllCollections,
    getCollection,
    addCollection,
    getCollectionObjByName,
    getCategoryObjByName,
    saveCollectionCollectible
};