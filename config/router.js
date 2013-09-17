/*
 * Geddy JavaScript Web development framework
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */


var router = new geddy.RegExpRouter();

router.get('/').to('Main.index');
router.post('/').to('Main.login');
router.get('/login').to('Main.login');
router.get('/logout').to('Main.logout');
// Basic routes
// router.match('/moving/pictures/:id', 'GET').to('Moving.pictures');
//
// router.match('/farewells/:farewelltype/kings/:kingid', 'GET').to('Farewells.kings');
//
// Can also match specific HTTP methods only
// router.get('/xandadu').to('Xanadu.specialHandler');
// router.del('/xandadu/:id').to('Xanadu.killItWithFire');
//
// Resource-based routes
// router.resource('hemispheres');
//
// Nested Resource-based routes
// router.resource('hemispheres', function(){
//   this.resource('countries');
//   this.get('/print(.:format)').to('Hemispheres.print');
// });

router.resource('game_configurations');
router.resource('alliances');
router.resource('users');
router.resource('tiles');
router.resource('buildings');
router.resource('building_informations');
router.resource('building_storages');
router.resource('crops');
router.resource('crop_informations');
router.resource('map');
router.resource('weaponInformations');

router.post('/tiles/attack').to('tiles.attack');
router.post('/tiles/watering').to('tiles.watering');
router.post('/tiles/fertilizing').to('tiles.fertilizing');
router.post('/crops/harvest').to('crops.harvest');
router.post('/crops/sell').to('crops.sell');
router.post('/users/hit').to('users.hit');
router.post('/building_storages/cropsCount').to('building_storages.cropsCount');
router.post('/building_storages/sellCrop').to('building_storages.sellCrop');
router.get('/weaponInformations/store').to('weaponInformations.store');
router.post('/weaponInformations/buy').to('weaponInformations.buy');

router.resource('fights');
exports.router = router;
