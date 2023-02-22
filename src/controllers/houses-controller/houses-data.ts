import { HouseModel } from './types';

const houses: HouseModel[] = [
  {
    id: '1',
    title: 'Luxury lakeside apartment',
    location: {
      country: 'Italy',
      city: 'Riva',
    },
    images: [
      'https://a0.muscache.com/im/pictures/53992414/64510035_original.jpg?im_w=1200',
      'https://a0.muscache.com/im/pictures/50929425/fe82ce80_original.jpg?im_w=1440',
      'https://a0.muscache.com/im/pictures/53990750/56308305_original.jpg?im_w=1440',
    ],
    price: '80€',
    rating: 4.85,
  },
  {
    id: '2',
    title: 'Pension Langbrucker',
    location: {
      country: 'Austria',
      city: 'Großsölk',
    },
    images: [
      'https://a0.muscache.com/im/pictures/42b66999-b94c-4d3c-ad90-41c1a02aeee3.jpg?im_w=1200',
      'https://a0.muscache.com/im/pictures/a91fe631-33e3-44b4-82a8-9c29c1b687f8.jpg?im_w=1440',
      'https://a0.muscache.com/im/pictures/8987fe4a-9d36-45cc-934c-d78e6334e968.jpg?im_w=1440',
    ],
    price: '47€',
    rating: 4.97,
  },
  {
    id: '5',
    title: 'Hiša Mija',
    location: {
      country: 'Slovenia',
      city: 'Kobarid',
    },
    images: [
      'https://a0.muscache.com/im/pictures/31fba81b-c0a9-4cca-b728-ba9383370351.jpg?im_w=1200',
      'https://a0.muscache.com/im/pictures/2a3d95c4-7400-4b10-83ab-18abf3593fad.jpg?im_w=1440',
      'https://a0.muscache.com/im/pictures/b53d93a7-a44a-43fa-bb45-66d776a374d9.jpg?im_w=1440',
    ],
    price: '220€',
    rating: 4.88,
  },
  {
    id: '6',
    title: 'Right on Walchensee',
    location: {
      country: 'Germany',
      city: 'Urfeld',
    },
    images: [
      'https://a0.muscache.com/im/pictures/0727a6ef-01c4-4a0c-b08e-8097faf44e24.jpg?im_w=1200',
      'https://a0.muscache.com/im/pictures/5df4b433-ef00-446f-8a23-365b8b0745c1.jpg?im_w=1440',
      'https://a0.muscache.com/im/pictures/6198d532-d301-4a85-8ec1-ac88b2847275.jpg?im_w=1440',
    ],
    price: '123€',
    rating: 4.93,
  },
  {
    id: '7',
    title: 'Babiogórska Chata',
    location: {
      country: 'Poland',
      city: 'Zawoja',
    },
    images: [
      'https://a0.muscache.com/im/pictures/miso/Hosting-679035048103481661/original/362c5756-cefb-4d1d-bdaf-11e271cf6ece.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/miso/Hosting-679035048103481661/original/598f5902-2493-44ca-92d0-988deb04697a.jpeg?im_w=1440',
      'https://a0.muscache.com/im/pictures/miso/Hosting-679035048103481661/original/0f3a0966-3590-48df-95d3-c2a0b9a7a617.jpeg?im_w=1440',
    ],
    price: '176€',
    rating: 4.86,
  },
  {
    id: '8',
    title: 'Holiday Hill 58',
    location: {
      country: 'Czechia',
      city: 'Černý Důl',
    },
    images: [
      'https://a0.muscache.com/im/pictures/prohost-api/Hosting-49312235/original/b2e0285e-5e90-4b6b-8a40-f48fd227c8f1.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/prohost-api/Hosting-49312235/original/0fddd4a2-e422-4886-af90-9ee5b0ba9cfb.jpeg?im_w=1440',
      'https://a0.muscache.com/im/pictures/prohost-api/Hosting-49312235/original/81d83a7e-bbf1-48f2-9fc4-f1150150ab92.jpeg?im_w=1440',
    ],
    price: '164€',
    rating: 4.53,
  },
  {
    id: '10',
    title: 'Charming cottage',
    location: {
      country: 'Denmark',
      city: 'Fredericia',
    },
    images: [
      'https://a0.muscache.com/im/pictures/miso/Hosting-48594714/original/d91864d5-77fc-46b3-8508-f3affa1fe41e.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/miso/Hosting-48594714/original/c6145593-105b-4e77-ab3d-c640fc0fb471.jpeg?im_w=1440',
      'https://a0.muscache.com/im/pictures/miso/Hosting-48594714/original/8f9db099-bea8-45af-997c-3042783d22c1.jpeg?im_w=1440',
    ],
    price: '376€',
    rating: 4.94,
  },
  {
    id: '11',
    title: 'Private family villa',
    location: {
      country: 'Italy',
      city: 'Vesta',
    },
    images: [
      'https://a0.muscache.com/im/pictures/63642676-88c0-48b4-ac3c-b3cad3c16827.jpg?im_w=1200',
      'https://a0.muscache.com/im/pictures/b50df3de-33f2-4d3e-96f7-2c9a325e065b.jpg?im_w=1440',
      'https://a0.muscache.com/im/pictures/0f2d3778-f6a1-4b72-be1c-f76dcab3af1d.jpg?im_w=1440',
    ],
    price: '162€',
    rating: 4.78,
  },
  {
    id: '12',
    title: 'Komfort Aclas Maiensäss Resort',
    location: {
      country: 'Switzerland',
      city: 'Urmein',
    },
    images: [
      'https://a0.muscache.com/im/pictures/prohost-api/Hosting-19525574/original/3b6b186a-6455-497d-aa55-ad8abcab2758.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/prohost-api/Hosting-19525574/original/25d975ec-2907-48c3-a00b-70cdd30267bc.jpeg?im_w=1440',
      'https://a0.muscache.com/im/pictures/prohost-api/Hosting-19525574/original/d8656e93-b73b-42f9-8875-6281f66b2189.jpeg?im_w=1440',
    ],
    price: '225€',
    rating: 4.64,
  },
];

export default houses;
