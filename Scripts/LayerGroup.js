


//function GetArrayItem(aryToSearch, propName, val) {
//    for (var x = 0; x < aryToSearch.length; x++) {
//        if (aryToSearch[x][propName] == val) {
//            return aryToSearch[x];
//        }
//    }
//    return null;
//}
//function MapService(url, layers) {
//    var that = this;
//    this.Url = url;
//    this.Layers = layers;
//    this.LoadService = _loadService;

//    function _loadService(serviceLoaded) {
//        require([
//            "esri/layers/ArcGISDynamicMapServiceLayer",
//            "esri/request",
//            "esri/geometry/Extent",
//            "esri/tasks/GeometryService",
//            "esri/tasks/ProjectParameters",
//            "dojo/promise/all",
//            "dojo/on"
//        ], function (esriDynamicLayer, esriRequest, esriExtent, esriGeometryService, esriProjectParameters, dojoPromiseAll, on) {
//            that.Layer = new esriDynamicLayer(that.Url);
//            that.Layer.on("load", function (evt) {
//                evt.layer.show();
//                var visibleLayers = [];
//                for (var layerCount = 0; layerCount < that.Layers.length; layerCount++) {
//                    if (that.Layers[layerCount].Visible) {
//                        visibleLayers.push(that.Layers[layerCount].LayerId);
//                    }

//                    if (that.Layers[layerCount].Relationships) {
//                        var layerRequest = new esriRequest({
//                            url: that.Url + '/' + that.Layers[layerCount].LayerId,
//                            content: { f: "json" },
//                            handleAs: "json",
//                            callbackParamName: "callback"
//                        });
//                        var currentLayerCount = layerCount;
//                        layerRequest.then(function (layerResponse) {
//                            //find the relationship metadata that matches the relationship specified in the config

//                            (function (layerResponse, currentLayerCount) {
//                                var relRequests = [];
//                                var relRequestInfo = [];
//                                for (var relCount = 0; relCount < that.Layers[currentLayerCount].Relationships.length; relCount++) {
//                                    var relName = that.Layers[currentLayerCount].Relationships[relCount].RelationshipName;
//                                    var rel = GetArrayItem(layerResponse.relationships, 'name', relName);
//                                    if (rel != null) {
//                                        relRequestInfo.push({ tableId: rel.relatedTableId, keyField: rel.keyField, name: relName, relId: rel.id });
//                                        var relRequest = new esriRequest({
//                                            url: that.Url + '/' + rel.relatedTableId,
//                                            content: { f: "json" },
//                                            handleAs: "json",
//                                            callbackParamName: "callback"
//                                        });
//                                        relRequests.push(relRequest);
//                                    }
//                                }
//                                promises = dojoPromiseAll(relRequests);
//                                promises.then(function (relResponses) {
//                                    (function (relResponses, relRequestInfo, currentLayerCount) {
//                                        for (var respCount = 0; respCount < relResponses.length; respCount++){
//                                            //response is about the related table specified in relRequestInfo
//                                            var subRel = GetArrayItem(relResponses[respCount].relationships, 'id', relRequestInfo[respCount].relId);
//                                            var relName = relRequestInfo[respCount].name;
//                                            var primaryKeyField = relRequestInfo[respCount].keyField;
//                                            var relatedTableId = relRequestInfo[respCount].tableId;
//                                            var foreignKeyField = subRel.keyField;
//                                            for (var y = 0; y < that.Layers[currentLayerCount].Relationships.length; y++) {
//                                                if (that.Layers[currentLayerCount].Relationships[y].RelationshipName == relName) {
//                                                    that.Layers[currentLayerCount].Relationships[y].FieldInfo = relResponses[respCount].fields;
//                                                    that.Layers[currentLayerCount].Relationships[y].PrimaryKeyField = primaryKeyField;
//                                                    that.Layers[currentLayerCount].Relationships[y].ForeignKeyField = foreignKeyField;
//                                                    that.Layers[currentLayerCount].Relationships[y].RelatedTableId = relatedTableId;
//                                                    that.Layers[currentLayerCount].Relationships[y].Id = relRequestInfo[respCount].relId;
//                                                }
//                                            }

//                                        }
//                                    })(relResponses, relRequestInfo, currentLayerCount);
//                                });

//                            })(layerResponse, currentLayerCount);
//                        });
//                    }


//                    if (that.Layers[layerCount].IsDefaultExtent) {
//                        var extRequest = new esriRequest({
//                            url: that.Url + '/' + that.Layers[layerCount].LayerId,
//                            content: { f: "json" },
//                            handleAs: "json",
//                            callbackParamName: "callback"
//                        });
//                        extRequest.then(function (resp) {
//                            var newExt = new esriExtent(resp.extent);
//                            if (newExt.spatialReference.wkid != app.Map.spatialReference.wkid) {
//                                var geometryService = new esriGeometryService(gGeometryServiceUrl);
//                                var projectParameters = new esriProjectParameters();
//                                projectParameters.geometries = [newExt];
//                                projectParameters.outSR = app.Map.spatialReference;
//                                geometryService.project(projectParameters, function (projectGeometry) {
//                                    app.InitialExtent = projectGeometry[0];
//                                    app.Map.setExtent(app.InitialExtent);
//                                }, function (projectError) {
//                                    var errorText = "??";
//                                });
//                            }
//                            else {
//                                app.Map.setExtent(newExt);
//                            }

//                        });
//                    }
//                }
//                if (visibleLayers.length == 0) {
//                    //layers that have a sigle layerInfo need to be turned off
//                    if (evt.layer.layerInfos.length == 1) {
//                        evt.layer.hide();
//                    }
//                    else {
//                        evt.layer.setVisibleLayers([-1]);
//                    }

//                }
//                else {
//                    evt.layer.setVisibleLayers(visibleLayers);
//                }

//                serviceLoaded(evt.layer, that.Url);
//            });
//            that.Layer.on("error", function (err) {
//                var ff = 5;
//            });
//            app.Map.addLayer(that.Layer);


//        });
//    }
//}



//function MapLayer(url, queryable, name, order, groupName, initialExtent) {
//    var that = this;
//    this.UseInitialExtent = initialExtent;
//    this.LayerId = null;
//    var _url;
//    this.Name = name;
//    this.Url = url;
//    this.GroupName = groupName;
//    _url = url;
//    this.Queryable = queryable;
//    if (order) this.GroupOrder = order;
//    this.Layers = [];
//    this.Layer = null;
//    this.LoadLayer = _loadLayer;
//    function endsWith(str, suffix) {
//        return str.indexOf(suffix, str.length - suffix.length) !== -1;
//    }
//    function _loadLayer(layerLoaded) {
//        require([
//            "esri/layers/ArcGISDynamicMapServiceLayer",
//            "esri/layers/FeatureLayer",
//            "dojo/on"
//        ], function (esriDynamicLayer, esriFeatureLayer, on) {
//            if (endsWith(_url.toLowerCase(), 'server')) {
//                that.Layer = new esriDynamicLayer(_url);
//            }
//            else {
//                that.Layer = new esriFeatureLayer(_url);
//            }


//            that.Layer.on("load", function (evt) {
//                evt.layer.show();
//                if (that.UseInitialExtent) {

//                }
//                if (evt.layer.initialExtent != undefined) {
//                    app.Map.setExtent(evt.layer.initialExtent);
//                    var tt = 5;
//                }


//                layerLoaded(evt.layer, _url);
//            });
//            that.Layer.on("error", function (err) {
//                var ff = 5;
//            });
//            app.Map.addLayer(that.Layer);


//        });
//    };
//    //this.AddLayer = _addLayer;
//    //function _addLayer(url, queryable, name) {
//    //    var layer = {};
//    //    layer.Url = url;
//    //    layer.Queryable = queryable;
//    //    if (name) layer.Name = name;
//    //    this.Layers.push(layer);
//    //}
//}


//function LayerCollection() {

//}


//function GetArrayIndex(aryToSearch, propName, val) {
//    for (var x = 0; x < aryToSearch.length; x++) {
//        if (aryToSearch[x][propName] == val) {
//            return x;
//        }
//    }
//    return -1;
//}

//function LayerCollection() {
//    this.Layers = [];
//    this.Services = [];
//    var _layerCount = 0;
//    var _serviceCount = 0;
//    this.AddLayer = _addLayer;
//    this.AddService = _addService;
//    this.LoadLayers = _loadLayers;
//    this.LoadServices = _loadServices;
//    this.PopulateLegendHtml = _populateLegendHtml;
//    this.PopulateServiceLegendHtml = _populateServiceLegendHtml;
//    var _loadCount = 0;
//    var that = this;
//    function _addLayer(mapLayer) {
//        var layer = new MapLayer(mapLayer.Url, mapLayer.Queryable, mapLayer.Name, mapLayer.GroupOrder, mapLayer.GroupName, mapLayer.UseInitialExtent);
//        layer.Id = this.Layers.length + 1;
//        this.Layers.push(layer);
//        _layerCount++;
//    }

//    function _addService(mapService) {
//        var layer = new MapService(mapService.Url, mapService.Layers);
//        layer.Id = this.Services.length + 1;
//        this.Services.push(layer);
//        _serviceCount++;
//    }

//    function _populateServiceLegendHtml(legendInfos, layerInfos) {
//        for (var serviceCount = 0; serviceCount < this.Services.length; serviceCount++) {

//            var legendIndex = GetArrayIndex(legendInfos, "Url", this.Services[serviceCount].Url);
//            this.Services[serviceCount].LegendInfo = legendInfos[legendIndex];

//            for (var layerCount = 0; layerCount < this.Services[serviceCount].Layers.length; layerCount++) {
//                var layerIndex = GetArrayIndex(layerInfos, "Url", this.Services[serviceCount].Url + '/' + this.Services[serviceCount].Layers[layerCount].LayerId);
//                this.Services[serviceCount].Layers[layerCount].LayerInfo = layerInfos[layerIndex];

//                var layerLegendIndex = GetArrayIndex(this.Services[serviceCount].LegendInfo.layers, "layerId", this.Services[serviceCount].Layers[layerCount].LayerId);
//                //app.MapLayers.Services[serviceCount].Layers[layerCount].LegendInfo = app.MapLayers[serviceCount].LegendInfo[layerLegendIndex];
//                //populate the legend info for each sub layer
//                var currentLegendInfo = this.Services[serviceCount].LegendInfo.layers[layerLegendIndex];
//                this.Services[serviceCount].Layers[layerCount].LegendInfo = currentLegendInfo;
//                var currentLayerInfo = this.Services[serviceCount].Layers[layerCount].LayerInfo;

//                if (currentLayerInfo.drawingInfo) {
//                    if (currentLayerInfo.drawingInfo.renderer.type == 'simple') {
//                        this.Services[serviceCount].Layers[layerCount].LegendInfo.SimpleRenderer = {};
//                        this.Services[serviceCount].Layers[layerCount].LegendInfo.SimpleRenderer.Symbology = currentLegendInfo.legend[0];
//                    }
//                    else {
//                        this.Services[serviceCount].Layers[layerCount].LegendInfo.UniqueRenderer = {};
//                        if (currentLayerInfo.drawingInfo.renderer.type == 'classBreaks') {
//                            this.Services[serviceCount].Layers[layerCount].LegendInfo.UniqueRenderer.FieldName = currentLayerInfo.drawingInfo.renderer.field;
//                        }
//                        else {
//                            this.Services[serviceCount].Layers[layerCount].LegendInfo.UniqueRenderer.FieldName = currentLayerInfo.drawingInfo.renderer.field1;
//                        }

//                        this.Services[serviceCount].Layers[layerCount].LegendInfo.UniqueRenderer.UniqueValues = [];
//                        for (var legendCount = 0; legendCount < currentLegendInfo.legend.length; legendCount++) {
//                            var uv = {};
//                            uv.Label = currentLegendInfo.legend[legendCount].label;
//                            uv.Symbology = currentLegendInfo.legend[legendCount];
//                            this.Services[serviceCount].Layers[layerCount].LegendInfo.UniqueRenderer.UniqueValues.push(uv);
//                        }
//                        this.Services[serviceCount].Layers[layerCount].LegendInfo.UniqueRenderer.UniqueValues.sort(function (a, b) {
//                            var textA = a.Label;
//                            var textB = b.Label;
//                            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
//                        });
//                    }
//                }
//            }
//        }


//        //if (layerInfo.drawingInfo) {
//        //    if (layerInfo.drawingInfo.renderer.type == 'simple') {
//        //        this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.SimpleRenderer = {};
//        //        this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.SimpleRenderer.Symbology = layerLegendInfo[0];
//        //    }
//        //    else {
//        //        this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.UniqueRenderer = {};
//        //        this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.UniqueRenderer.FieldName = layerInfo.drawingInfo.renderer.field1;
//        //        this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.UniqueRenderer.UniqueValues = [];
//        //        for (var legendCount = 0; legendCount < layerLegendInfo.length; legendCount++) {
//        //            var uv = {};
//        //            uv.Label = layerLegendInfo[legendCount].label;
//        //            uv.Symbology = layerLegendInfo[legendCount];
//        //            this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.UniqueRenderer.UniqueValues.push(uv);
//        //        }
//        //        this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.UniqueRenderer.UniqueValues.sort(function (a, b) {
//        //            var textA = a.Label;
//        //            var textB = b.Label;
//        //            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
//        //        });

//        //        //sort by a-z
//        //    }
//        //    break;
//        //}
//        //at this point, each sub layer has a legendInfo and layerInfo object associated with it


//    }
//    function _populateLegendHtml(legendInfos, layerInfos) {
//        //var currentResponse = response[responseCount];

//        for (var layerCount = 0; layerCount < this.Layers.length; layerCount++) {

//            var mapLayer = this.Layers[layerCount].Layer;
//            var layerInfo, layerLegendInfo, serviceLegendInfo;


//            if (this.Layers[layerCount].Layer.layerInfos && this.Layers[layerCount].Layer.layerInfos.length > 0) {

//                for (var legendInfoCount = 0; legendInfoCount < legendInfos.length; legendInfoCount++) {
//                    if (this.Layers[layerCount].Layer.url.indexOf(legendInfos[legendInfoCount].Url) != -1) {
//                        //correct legend info for this map service
//                        serviceLegendInfo = legendInfos[legendInfoCount];
//                        //loop through sublayers first, then match to layerInfo
//                        for (var subLayerCount = 0; subLayerCount < this.Layers[layerCount].Layer.layerInfos.length; subLayerCount++) {
//                            var subLayerId = this.Layers[layerCount].Layer.layerInfos[subLayerCount].id;
//                            for (var serviceLayerCount = 0; serviceLayerCount < serviceLegendInfo.layers.length; serviceLayerCount++) {
//                                if (serviceLegendInfo.layers[serviceLayerCount].layerId == subLayerId) {
//                                    layerLegendInfo = serviceLegendInfo.layers[serviceLayerCount].legend;
//                                    this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo = {};
//                                    var sublayerUrl = this.Layers[layerCount].Layer.url + '/' + subLayerId.toString();
//                                    //now we need to find the proper layer info object
//                                    for (var layerInfoCount = 0; layerInfoCount < layerInfos.length; layerInfoCount++) {
//                                        if (layerInfos[layerInfoCount].Url == sublayerUrl) {
//                                            layerInfo = layerInfos[layerInfoCount];
//                                            if (layerInfo.drawingInfo) {
//                                                if (layerInfo.drawingInfo.renderer.type == 'simple') {
//                                                    this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.SimpleRenderer = {};
//                                                    this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.SimpleRenderer.Symbology = layerLegendInfo[0];
//                                                }
//                                                else {
//                                                    this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.UniqueRenderer = {};
//                                                    this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.UniqueRenderer.FieldName = layerInfo.drawingInfo.renderer.field1;
//                                                    this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.UniqueRenderer.UniqueValues = [];
//                                                    for (var legendCount = 0; legendCount < layerLegendInfo.length; legendCount++) {
//                                                        var uv = {};
//                                                        uv.Label = layerLegendInfo[legendCount].label;
//                                                        uv.Symbology = layerLegendInfo[legendCount];
//                                                        this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.UniqueRenderer.UniqueValues.push(uv);
//                                                    }
//                                                    this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.UniqueRenderer.UniqueValues.sort(function (a, b) {
//                                                        var textA = a.Label;
//                                                        var textB = b.Label;
//                                                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
//                                                    });

//                                                    //sort by a-z
//                                                }

//                                                break;
//                                            }
//                                            else {
//                                                //annotation
//                                            }

//                                            break;
//                                        }
//                                    }
//                                    break;



//                                }
//                            }
//                        }
//                    }
//                }



//                //group layer
//                //for (var layerInfoCount = 0; layerInfoCount < layerInfos.length; layerInfoCount++) {
//                //    //what if we have ..../MapServer and the layerInfos is ..../MapServer/0 (i.e. school group layer)
//                //    if (layerInfos[layerInfoCount].Url.indexOf(this.Layers[layerCount].Layer.url) != -1) {
//                //        layerInfo = layerInfos[layerInfoCount];
//                //        for (var legendInfoCount = 0; legendInfoCount < legendInfos.length; legendInfoCount++) {
//                //            if (this.Layers[layerCount].Layer.url.indexOf(legendInfos[legendInfoCount].Url) != -1) {

//                //                serviceLegendInfo = legendInfos[legendInfoCount];
//                //                for (var subLayerCount = 0; subLayerCount < this.Layers[layerCount].Layer.layerInfos.length; subLayerCount++) {
//                //                    var subLayerId = this.Layers[layerCount].Layer.layerInfos[subLayerCount].id;
//                //                    for (var serviceLayerCount = 0; serviceLayerCount < serviceLegendInfo.layers.length; serviceLayerCount++) {
//                //                        if (serviceLegendInfo.layers[serviceLayerCount].layerId == subLayerId) {
//                //                            layerLegendInfo = serviceLegendInfo.layers[serviceLayerCount].legend;
//                //                            this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo = {};
//                //                            if (layerInfo.drawingInfo)
//                //                            {
//                //                                if (layerInfo.drawingInfo.renderer.type == 'simple') {
//                //                                    this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.SimpleRenderer = {};
//                //                                    this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.SimpleRenderer.Symbology = legendInfo[0];
//                //                                }
//                //                                else {
//                //                                    this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.UniqueRenderer = {};
//                //                                    this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.UniqueRenderer.FieldName = layerInfo.drawingInfo.renderer.field1;
//                //                                    this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.UniqueRenderer.UniqueValues = [];
//                //                                    for (var legendCount = 0; legendCount < layerLegendInfo.length; legendCount++) {
//                //                                        var uv = {};
//                //                                        uv.Label = layerLegendInfo[legendCount].label;
//                //                                        uv.Symbology = layerLegendInfo[legendCount];
//                //                                        this.Layers[layerCount].Layer.LegendInfo.UniqueRenderer.UniqueValues.push(uv);
//                //                                    }
//                //                                    this.Layers[layerCount].Layer.LegendInfo.UniqueRenderer.UniqueValues.sort(function (a, b) {
//                //                                        var textA = a.Label;
//                //                                        var textB = b.Label;
//                //                                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
//                //                                    });

//                //                                    //sort by a-z
//                //                                }
//                //                                break;
//                //                            }
//                //                            else {
//                //                                //annotation
//                //                            }

//                //                        }
//                //                    }
//                //                }
//                //                break;
//                //            }
//                //        }
//                //        break;
//                //    }
//                //}
//            }
//            else {
//                //single layer
//                for (var layerInfoCount = 0; layerInfoCount < layerInfos.length; layerInfoCount++) {
//                    if (this.Layers[layerCount].Layer.url == 'https://firstmap.gis.delaware.gov/arcgis/rest/services/BaseMap/DE_Basemap/MapServer/11') {
//                        var ted = 5;
//                    }
//                    //                        
//                    if (layerInfos[layerInfoCount].Url == this.Layers[layerCount].Layer.url) {
//                        layerInfo = layerInfos[layerInfoCount];
//                        for (var legendInfoCount = 0; legendInfoCount < legendInfos.length; legendInfoCount++) {
//                            if (this.Layers[layerCount].Layer.url.indexOf(legendInfos[legendInfoCount].Url) != -1) {
//                                serviceLegendInfo = legendInfos[legendInfoCount];

//                                //for layers such as MapServer/11 - we can't just assume the layer id is a single digit
//                                if (this.Layers[layerCount].Layer.url == 'https://firstmap.gis.delaware.gov/arcgis/rest/services/BaseMap/DE_Basemap/MapServer/11') {
//                                    var ted = 5;
//                                }
//                                var lastSlash = this.Layers[layerCount].Layer.url.lastIndexOf('/') + 1;
//                                var layerIdLength = this.Layers[layerCount].Layer.url.length - lastSlash;

//                                var layerId = parseInt(this.Layers[layerCount].Layer.url.substring(lastSlash));
//                                for (var serviceLayerCount = 0; serviceLayerCount < serviceLegendInfo.layers.length; serviceLayerCount++) {
//                                    if (serviceLegendInfo.layers[serviceLayerCount].layerId == layerId) {
//                                        legendInfo = serviceLegendInfo.layers[serviceLayerCount].legend;
//                                        this.Layers[layerCount].Layer.LegendInfo = {};
//                                        if (layerInfo.drawingInfo.renderer.type == 'simple') {
//                                            this.Layers[layerCount].Layer.LegendInfo.SimpleRenderer = {};
//                                            this.Layers[layerCount].Layer.LegendInfo.SimpleRenderer.Symbology = legendInfo[0];
//                                        }
//                                        else {
//                                            this.Layers[layerCount].Layer.LegendInfo.UniqueRenderer = {};
//                                            this.Layers[layerCount].Layer.LegendInfo.UniqueRenderer.FieldName = layerInfo.drawingInfo.renderer.field1;
//                                            this.Layers[layerCount].Layer.LegendInfo.UniqueRenderer.UniqueValues = [];

//                                            //some symbols may reprsent multiple values - loop through legend infos
//                                            for (var legendCount = 0; legendCount < legendInfo.length; legendCount++) {
//                                                var uv = {};
//                                                uv.Label = legendInfo[legendCount].label;
//                                                uv.Symbology = legendInfo[legendCount];
//                                                this.Layers[layerCount].Layer.LegendInfo.UniqueRenderer.UniqueValues.push(uv);
//                                            }
//                                            this.Layers[layerCount].Layer.LegendInfo.UniqueRenderer.UniqueValues.sort(function (a, b) {
//                                                var textA = a.Label;
//                                                var textB = b.Label;
//                                                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
//                                            });


//                                            //for (var uniqueCount = 0; uniqueCount < layerInfo.drawingInfo.renderer.uniqueValueInfos.length; uniqueCount++) {
//                                            //    var uv = {};
//                                            //    uv.Value = layerInfo.drawingInfo.renderer.uniqueValueInfos[uniqueCount].value;
//                                            //    uv.Label = layerInfo.drawingInfo.renderer.uniqueValueInfos[uniqueCount].label;
//                                            //    uv.Description = layerInfo.drawingInfo.renderer.uniqueValueInfos[uniqueCount].description;
//                                            //    for (var legendCount = 0; legendCount < legendInfo.length; legendCount++) {
//                                            //        if (legendInfo[legendCount].label == uv.Label) {
//                                            //            uv.Symbology = legendInfo[legendCount];
//                                            //            break;
//                                            //        }
//                                            //    }
//                                            //    mapLayer.LegendInfo.UniqueRenderer.UniqueValues.push(uv);
//                                            //}

//                                            //sort by a-z
//                                        }
//                                        break;
//                                    }
//                                }


//                                //https://firstmap.gis.delaware.gov/arcgis/rest/services/BaseMap/DE_Basemap/MapServer/legend?f=pjson
//                                //layers.
//                                //  layerId
//                                //  layerType
//                                //  legend[
//                                //      label - join to below request on label
//                                //      url
//                                //      imageData
//                                //      contentType
//                                //      height
//                                //      width
//                                //          values[]
//                                //      ]

//                                //https://firstmap.gis.delaware.gov/arcgis/rest/services/BaseMap/DE_Basemap/MapServer/2?f=pjson
//                                //id
//                                //name
//                                //description
//                                //geometryType
//                                //sublayers
//                                //drawingInfo
//                                //  renderer
//                                //      type (uniqueValue or simple)
//                                //      field1
//                                //      field2
//                                //      field3
//                                //      uniqueValueInfos[]
//                                //          symbol
//                                //          value (field value)
//                                //          label
//                                //          description
//                                break;
//                            }
//                        }
//                        break;
//                    }
//                }
//            }





//            //find matching layer info
//            //find matching legend info

//        }

//        var gggdd = 554;
//    }


//    function _loadServices(groupNames, servicesLoaded) {

//        //do this in descending order in the way we added them
//        for (var x = this.Services.length - 1; x >= 0; x--) {
//            this.Services[x].LoadService(serviceLoaded);
//        }

//        function serviceLoaded(lyr, url) {
//            _loadCount++;
//            for (var x = 0; x < that.Services.length; x++) {
//                (function (x) {
//                    if (that.Services[x].Url == url) {
//                        that.Services[x].Layer = lyr;
//                    }
//                })(x);

//            }
//            if (_loadCount == _serviceCount) {
//                servicesLoaded();
//            }

//        }
//    }


//    function _loadLayers(groupNames, layersLoaded) {

//        //sort based on group, then based on order within group
//        groupNames.sort(function (a, b) {
//            return b.Order - a.Order
//        });

//        var sortedLayers = [];
//        var loadOrder = 1;
//        for (var groupCount = 0; groupCount < groupNames.length; groupCount++) {
//            var groupName = groupNames[groupCount].Name;
//            var groupLayers = [];
//            for (var layerCount = 0; layerCount < this.Layers.length; layerCount++) {
//                if (this.Layers[layerCount].GroupName == groupName) {
//                    groupLayers.push(this.Layers[layerCount]);
//                }
//            }

//            groupLayers.sort(function (c, d) {
//                return d.GroupOrder - c.GroupOrder
//            });

//            for (var sortCount = 0; sortCount < groupLayers.length; sortCount++) {
//                sortedLayers.push(groupLayers[sortCount]);
//            }
//        }

//        for (var sortCount = 0; sortCount < sortedLayers.length; sortCount++) {
//            sortedLayers[sortCount].LoadOrder = sortCount + 1;
//        }

//        that.Layers = sortedLayers;



//        for (var x = 0; x < this.Layers.length; x++) {
//            this.Layers[x].LoadLayer(layerLoaded);
//        }

//        function layerLoaded(lyr, url) {
//            _loadCount++;
//            for (var x = 0; x < that.Layers.length; x++) {
//                (function (x) {
//                    if (that.Layers[x].Url == url) {
//                        that.Layers[x].Layer = lyr;
//                    }
//                })(x);

//            }
//            if (_loadCount == _layerCount) {
//                layersLoaded();
//            }

//        }
//    }


//}





function GetArrayItem(aryToSearch, propName, val) {
    for (var x = 0; x < aryToSearch.length; x++) {
        if (aryToSearch[x][propName] == val) {
            return aryToSearch[x];
        }
    }
    return null;
}
function MapService(url, layers) {
    var that = this;
    this.Url = url;
    this.Layers = layers;
    this.LoadService = _loadService;

    function _loadService(serviceLoaded) {
        require([
            "esri/layers/ArcGISDynamicMapServiceLayer",
            "esri/layers/ImageParameters",
            "esri/request",
            "esri/geometry/Extent",
            "esri/tasks/GeometryService",
            "esri/tasks/ProjectParameters",
            "dojo/promise/all",
            "dojo/on"
        ], function (esriDynamicLayer, esriImageParameters, esriRequest, esriExtent, esriGeometryService, esriProjectParameters, dojoPromiseAll, on) {
            var img = new esriImageParameters();
            img.format = 'png32';
            that.Layer = new esriDynamicLayer(that.Url, { "imageParameters": img });
            that.Layer.on("load", function (evt) {
                evt.layer.show();
                var visibleLayers = [];
                for (var layerCount = 0; layerCount < that.Layers.length; layerCount++) {
                    if (that.Layers[layerCount].Visible) {
                        visibleLayers.push(that.Layers[layerCount].LayerId);
                    }

                    if (that.Layers[layerCount].Relationships) {
                        var layerRequest = new esriRequest({
                            url: that.Url + '/' + that.Layers[layerCount].LayerId,
                            content: { f: "json" },
                            handleAs: "json",
                            callbackParamName: "callback"
                        });
                        var currentLayerCount = layerCount;
                        layerRequest.then(function (layerResponse) {
                            //find the relationship metadata that matches the relationship specified in the config

                            (function (layerResponse, currentLayerCount) {
                                var relRequests = [];
                                var relRequestInfo = [];
                                for (var relCount = 0; relCount < that.Layers[currentLayerCount].Relationships.length; relCount++) {
                                    var relName = that.Layers[currentLayerCount].Relationships[relCount].RelationshipName;
                                    var rel = GetArrayItem(layerResponse.relationships, 'name', relName);
                                    if (rel != null) {
                                        relRequestInfo.push({ tableId: rel.relatedTableId, keyField: rel.keyField, name: relName, relId: rel.id });
                                        var relRequest = new esriRequest({
                                            url: that.Url + '/' + rel.relatedTableId,
                                            content: { f: "json" },
                                            handleAs: "json",
                                            callbackParamName: "callback"
                                        });
                                        relRequests.push(relRequest);
                                    }
                                }
                                promises = dojoPromiseAll(relRequests);
                                promises.then(function (relResponses) {
                                    (function (relResponses, relRequestInfo, currentLayerCount) {
                                        for (var respCount = 0; respCount < relResponses.length; respCount++) {
                                            //response is about the related table specified in relRequestInfo
                                            var subRel = GetArrayItem(relResponses[respCount].relationships, 'id', relRequestInfo[respCount].relId);
                                            var relName = relRequestInfo[respCount].name;
                                            var primaryKeyField = relRequestInfo[respCount].keyField;
                                            var relatedTableId = relRequestInfo[respCount].tableId;
                                            var foreignKeyField = subRel.keyField;
                                            for (var y = 0; y < that.Layers[currentLayerCount].Relationships.length; y++) {
                                                if (that.Layers[currentLayerCount].Relationships[y].RelationshipName == relName) {
                                                    that.Layers[currentLayerCount].Relationships[y].FieldInfo = relResponses[respCount].fields;
                                                    that.Layers[currentLayerCount].Relationships[y].PrimaryKeyField = primaryKeyField;
                                                    that.Layers[currentLayerCount].Relationships[y].ForeignKeyField = foreignKeyField;
                                                    that.Layers[currentLayerCount].Relationships[y].RelatedTableId = relatedTableId;
                                                    that.Layers[currentLayerCount].Relationships[y].Id = relRequestInfo[respCount].relId;
                                                }
                                            }

                                        }
                                    })(relResponses, relRequestInfo, currentLayerCount);
                                });

                            })(layerResponse, currentLayerCount);
                        });
                    }


                    if (that.Layers[layerCount].IsDefaultExtent) {
                        var extRequest = new esriRequest({
                            url: that.Url + '/' + that.Layers[layerCount].LayerId,
                            content: { f: "json" },
                            handleAs: "json",
                            callbackParamName: "callback"
                        });
                        extRequest.then(function (resp) {
                            var newExt = new esriExtent(resp.extent);
                            if (newExt.spatialReference.wkid != app.Map.spatialReference.wkid) {
                                var geometryService = new esriGeometryService(gGeometryServiceUrl);
                                var projectParameters = new esriProjectParameters();
                                projectParameters.geometries = [newExt];
                                projectParameters.outSR = app.Map.spatialReference;
                                geometryService.project(projectParameters, function (projectGeometry) {
                                    app.InitialExtent = projectGeometry[0];
                                    app.Map.setExtent(app.InitialExtent);
                                }, function (projectError) {
                                    var errorText = "??";
                                });
                            }
                            else {
                                app.Map.setExtent(newExt);
                            }

                        });
                    }
                }
                if (visibleLayers.length == 0) {
                    //layers that have a sigle layerInfo need to be turned off
                    if (evt.layer.layerInfos.length == 1) {
                        evt.layer.hide();
                    }
                    else {
                        evt.layer.setVisibleLayers([-1]);
                    }

                }
                else {
                    evt.layer.setVisibleLayers(visibleLayers);
                }

                serviceLoaded(evt.layer, that.Url);
            });
            that.Layer.on("error", function (err) {
                var ff = 5;
            });
            app.Map.addLayer(that.Layer);


        });
    }
}



function MapLayer(url, queryable, name, order, groupName, initialExtent) {
    var that = this;
    this.UseInitialExtent = initialExtent;
    this.LayerId = null;
    var _url;
    this.Name = name;
    this.Url = url;
    this.GroupName = groupName;
    _url = url;
    this.Queryable = queryable;
    if (order) this.GroupOrder = order;
    this.Layers = [];
    this.Layer = null;
    this.LoadLayer = _loadLayer;
    function endsWith(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }
    function _loadLayer(layerLoaded) {
        require([
            "esri/layers/ArcGISDynamicMapServiceLayer",
            "esri/layers/FeatureLayer",
            "dojo/on"
        ], function (esriDynamicLayer, esriFeatureLayer, on) {
            if (endsWith(_url.toLowerCase(), 'server')) {
                that.Layer = new esriDynamicLayer(_url);
            }
            else {
                that.Layer = new esriFeatureLayer(_url);
            }


            that.Layer.on("load", function (evt) {
                evt.layer.show();
                if (that.UseInitialExtent) {

                }
                if (evt.layer.initialExtent != undefined) {
                    app.Map.setExtent(evt.layer.initialExtent);
                    var tt = 5;
                }


                layerLoaded(evt.layer, _url);
            });
            that.Layer.on("error", function (err) {
                var ff = 5;
            });
            app.Map.addLayer(that.Layer);


        });
    };
    //this.AddLayer = _addLayer;
    //function _addLayer(url, queryable, name) {
    //    var layer = {};
    //    layer.Url = url;
    //    layer.Queryable = queryable;
    //    if (name) layer.Name = name;
    //    this.Layers.push(layer);
    //}
}


function LayerCollection() {

}


function GetArrayIndex(aryToSearch, propName, val) {
    for (var x = 0; x < aryToSearch.length; x++) {
        if (aryToSearch[x][propName] == val) {
            return x;
        }
    }
    return -1;
}

function LayerCollection() {
    this.Layers = [];
    this.Services = [];
    var _layerCount = 0;
    var _serviceCount = 0;
    this.AddLayer = _addLayer;
    this.AddService = _addService;
    this.LoadLayers = _loadLayers;
    this.LoadServices = _loadServices;
    this.PopulateLegendHtml = _populateLegendHtml;
    this.PopulateServiceLegendHtml = _populateServiceLegendHtml;
    var _loadCount = 0;
    var that = this;
    function _addLayer(mapLayer) {
        var layer = new MapLayer(mapLayer.Url, mapLayer.Queryable, mapLayer.Name, mapLayer.GroupOrder, mapLayer.GroupName, mapLayer.UseInitialExtent);
        layer.Id = this.Layers.length + 1;
        this.Layers.push(layer);
        _layerCount++;
    }

    function _addService(mapService) {
        var layer = new MapService(mapService.Url, mapService.Layers);
        layer.Id = this.Services.length + 1;
        this.Services.push(layer);
        _serviceCount++;
    }

    function _populateServiceLegendHtml(legendInfos, layerInfos) {
        for (var serviceCount = 0; serviceCount < this.Services.length; serviceCount++) {

            var legendIndex = GetArrayIndex(legendInfos, "Url", this.Services[serviceCount].Url);
            this.Services[serviceCount].LegendInfo = legendInfos[legendIndex];

            for (var layerCount = 0; layerCount < this.Services[serviceCount].Layers.length; layerCount++) {
                var layerIndex = GetArrayIndex(layerInfos, "Url", this.Services[serviceCount].Url + '/' + this.Services[serviceCount].Layers[layerCount].LayerId);
                this.Services[serviceCount].Layers[layerCount].LayerInfo = layerInfos[layerIndex];

                var layerLegendIndex = GetArrayIndex(this.Services[serviceCount].LegendInfo.layers, "layerId", this.Services[serviceCount].Layers[layerCount].LayerId);
                //app.MapLayers.Services[serviceCount].Layers[layerCount].LegendInfo = app.MapLayers[serviceCount].LegendInfo[layerLegendIndex];
                //populate the legend info for each sub layer
                var currentLegendInfo = this.Services[serviceCount].LegendInfo.layers[layerLegendIndex];
                this.Services[serviceCount].Layers[layerCount].LegendInfo = currentLegendInfo;
                var currentLayerInfo = this.Services[serviceCount].Layers[layerCount].LayerInfo;

                if (currentLayerInfo.drawingInfo) {
                    if (currentLayerInfo.drawingInfo.renderer.type == 'simple') {
                        this.Services[serviceCount].Layers[layerCount].LegendInfo.SimpleRenderer = {};
                        this.Services[serviceCount].Layers[layerCount].LegendInfo.SimpleRenderer.Symbology = currentLegendInfo.legend[0];
                    }
                    else {
                        this.Services[serviceCount].Layers[layerCount].LegendInfo.UniqueRenderer = {};
                        if (currentLayerInfo.drawingInfo.renderer.type == 'classBreaks') {
                            this.Services[serviceCount].Layers[layerCount].LegendInfo.UniqueRenderer.FieldName = currentLayerInfo.drawingInfo.renderer.field;
                        }
                        else {
                            this.Services[serviceCount].Layers[layerCount].LegendInfo.UniqueRenderer.FieldName = currentLayerInfo.drawingInfo.renderer.field1;
                        }

                        this.Services[serviceCount].Layers[layerCount].LegendInfo.UniqueRenderer.UniqueValues = [];
                        for (var legendCount = 0; legendCount < currentLegendInfo.legend.length; legendCount++) {
                            var uv = {};
                            uv.Label = currentLegendInfo.legend[legendCount].label;
                            uv.Symbology = currentLegendInfo.legend[legendCount];
                            this.Services[serviceCount].Layers[layerCount].LegendInfo.UniqueRenderer.UniqueValues.push(uv);
                        }
                        this.Services[serviceCount].Layers[layerCount].LegendInfo.UniqueRenderer.UniqueValues.sort(function (a, b) {
                            var textA = a.Label;
                            var textB = b.Label;
                            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                        });
                    }
                }
            }
        }


        //if (layerInfo.drawingInfo) {
        //    if (layerInfo.drawingInfo.renderer.type == 'simple') {
        //        this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.SimpleRenderer = {};
        //        this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.SimpleRenderer.Symbology = layerLegendInfo[0];
        //    }
        //    else {
        //        this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.UniqueRenderer = {};
        //        this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.UniqueRenderer.FieldName = layerInfo.drawingInfo.renderer.field1;
        //        this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.UniqueRenderer.UniqueValues = [];
        //        for (var legendCount = 0; legendCount < layerLegendInfo.length; legendCount++) {
        //            var uv = {};
        //            uv.Label = layerLegendInfo[legendCount].label;
        //            uv.Symbology = layerLegendInfo[legendCount];
        //            this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.UniqueRenderer.UniqueValues.push(uv);
        //        }
        //        this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.UniqueRenderer.UniqueValues.sort(function (a, b) {
        //            var textA = a.Label;
        //            var textB = b.Label;
        //            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        //        });

        //        //sort by a-z
        //    }
        //    break;
        //}
        //at this point, each sub layer has a legendInfo and layerInfo object associated with it


    }
    function _populateLegendHtml(legendInfos, layerInfos) {
        //var currentResponse = response[responseCount];

        for (var layerCount = 0; layerCount < this.Layers.length; layerCount++) {

            var mapLayer = this.Layers[layerCount].Layer;
            var layerInfo, layerLegendInfo, serviceLegendInfo;


            if (this.Layers[layerCount].Layer.layerInfos && this.Layers[layerCount].Layer.layerInfos.length > 0) {

                for (var legendInfoCount = 0; legendInfoCount < legendInfos.length; legendInfoCount++) {
                    if (this.Layers[layerCount].Layer.url.indexOf(legendInfos[legendInfoCount].Url) != -1) {
                        //correct legend info for this map service
                        serviceLegendInfo = legendInfos[legendInfoCount];
                        //loop through sublayers first, then match to layerInfo
                        for (var subLayerCount = 0; subLayerCount < this.Layers[layerCount].Layer.layerInfos.length; subLayerCount++) {
                            var subLayerId = this.Layers[layerCount].Layer.layerInfos[subLayerCount].id;
                            for (var serviceLayerCount = 0; serviceLayerCount < serviceLegendInfo.layers.length; serviceLayerCount++) {
                                if (serviceLegendInfo.layers[serviceLayerCount].layerId == subLayerId) {
                                    layerLegendInfo = serviceLegendInfo.layers[serviceLayerCount].legend;
                                    this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo = {};
                                    var sublayerUrl = this.Layers[layerCount].Layer.url + '/' + subLayerId.toString();
                                    //now we need to find the proper layer info object
                                    for (var layerInfoCount = 0; layerInfoCount < layerInfos.length; layerInfoCount++) {
                                        if (layerInfos[layerInfoCount].Url == sublayerUrl) {
                                            layerInfo = layerInfos[layerInfoCount];
                                            if (layerInfo.drawingInfo) {
                                                if (layerInfo.drawingInfo.renderer.type == 'simple') {
                                                    this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.SimpleRenderer = {};
                                                    this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.SimpleRenderer.Symbology = layerLegendInfo[0];
                                                }
                                                else {
                                                    this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.UniqueRenderer = {};
                                                    this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.UniqueRenderer.FieldName = layerInfo.drawingInfo.renderer.field1;
                                                    this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.UniqueRenderer.UniqueValues = [];
                                                    for (var legendCount = 0; legendCount < layerLegendInfo.length; legendCount++) {
                                                        var uv = {};
                                                        uv.Label = layerLegendInfo[legendCount].label;
                                                        uv.Symbology = layerLegendInfo[legendCount];
                                                        this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.UniqueRenderer.UniqueValues.push(uv);
                                                    }
                                                    this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.UniqueRenderer.UniqueValues.sort(function (a, b) {
                                                        var textA = a.Label;
                                                        var textB = b.Label;
                                                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                                                    });

                                                    //sort by a-z
                                                }

                                                break;
                                            }
                                            else {
                                                //annotation
                                            }

                                            break;
                                        }
                                    }
                                    break;



                                }
                            }
                        }
                    }
                }



                //group layer
                //for (var layerInfoCount = 0; layerInfoCount < layerInfos.length; layerInfoCount++) {
                //    //what if we have ..../MapServer and the layerInfos is ..../MapServer/0 (i.e. school group layer)
                //    if (layerInfos[layerInfoCount].Url.indexOf(this.Layers[layerCount].Layer.url) != -1) {
                //        layerInfo = layerInfos[layerInfoCount];
                //        for (var legendInfoCount = 0; legendInfoCount < legendInfos.length; legendInfoCount++) {
                //            if (this.Layers[layerCount].Layer.url.indexOf(legendInfos[legendInfoCount].Url) != -1) {

                //                serviceLegendInfo = legendInfos[legendInfoCount];
                //                for (var subLayerCount = 0; subLayerCount < this.Layers[layerCount].Layer.layerInfos.length; subLayerCount++) {
                //                    var subLayerId = this.Layers[layerCount].Layer.layerInfos[subLayerCount].id;
                //                    for (var serviceLayerCount = 0; serviceLayerCount < serviceLegendInfo.layers.length; serviceLayerCount++) {
                //                        if (serviceLegendInfo.layers[serviceLayerCount].layerId == subLayerId) {
                //                            layerLegendInfo = serviceLegendInfo.layers[serviceLayerCount].legend;
                //                            this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo = {};
                //                            if (layerInfo.drawingInfo)
                //                            {
                //                                if (layerInfo.drawingInfo.renderer.type == 'simple') {
                //                                    this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.SimpleRenderer = {};
                //                                    this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.SimpleRenderer.Symbology = legendInfo[0];
                //                                }
                //                                else {
                //                                    this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.UniqueRenderer = {};
                //                                    this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.UniqueRenderer.FieldName = layerInfo.drawingInfo.renderer.field1;
                //                                    this.Layers[layerCount].Layer.layerInfos[subLayerCount].LegendInfo.UniqueRenderer.UniqueValues = [];
                //                                    for (var legendCount = 0; legendCount < layerLegendInfo.length; legendCount++) {
                //                                        var uv = {};
                //                                        uv.Label = layerLegendInfo[legendCount].label;
                //                                        uv.Symbology = layerLegendInfo[legendCount];
                //                                        this.Layers[layerCount].Layer.LegendInfo.UniqueRenderer.UniqueValues.push(uv);
                //                                    }
                //                                    this.Layers[layerCount].Layer.LegendInfo.UniqueRenderer.UniqueValues.sort(function (a, b) {
                //                                        var textA = a.Label;
                //                                        var textB = b.Label;
                //                                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                //                                    });

                //                                    //sort by a-z
                //                                }
                //                                break;
                //                            }
                //                            else {
                //                                //annotation
                //                            }

                //                        }
                //                    }
                //                }
                //                break;
                //            }
                //        }
                //        break;
                //    }
                //}
            }
            else {
                //single layer
                for (var layerInfoCount = 0; layerInfoCount < layerInfos.length; layerInfoCount++) {
                    if (this.Layers[layerCount].Layer.url == 'https://firstmap.gis.delaware.gov/arcgis/rest/services/BaseMap/DE_Basemap/MapServer/11') {
                        var ted = 5;
                    }
                    //                        
                    if (layerInfos[layerInfoCount].Url == this.Layers[layerCount].Layer.url) {
                        layerInfo = layerInfos[layerInfoCount];
                        for (var legendInfoCount = 0; legendInfoCount < legendInfos.length; legendInfoCount++) {
                            if (this.Layers[layerCount].Layer.url.indexOf(legendInfos[legendInfoCount].Url) != -1) {
                                serviceLegendInfo = legendInfos[legendInfoCount];

                                //for layers such as MapServer/11 - we can't just assume the layer id is a single digit
                                if (this.Layers[layerCount].Layer.url == 'https://firstmap.gis.delaware.gov/arcgis/rest/services/BaseMap/DE_Basemap/MapServer/11') {
                                    var ted = 5;
                                }
                                var lastSlash = this.Layers[layerCount].Layer.url.lastIndexOf('/') + 1;
                                var layerIdLength = this.Layers[layerCount].Layer.url.length - lastSlash;

                                var layerId = parseInt(this.Layers[layerCount].Layer.url.substring(lastSlash));
                                for (var serviceLayerCount = 0; serviceLayerCount < serviceLegendInfo.layers.length; serviceLayerCount++) {
                                    if (serviceLegendInfo.layers[serviceLayerCount].layerId == layerId) {
                                        legendInfo = serviceLegendInfo.layers[serviceLayerCount].legend;
                                        this.Layers[layerCount].Layer.LegendInfo = {};
                                        if (layerInfo.drawingInfo.renderer.type == 'simple') {
                                            this.Layers[layerCount].Layer.LegendInfo.SimpleRenderer = {};
                                            this.Layers[layerCount].Layer.LegendInfo.SimpleRenderer.Symbology = legendInfo[0];
                                        }
                                        else {
                                            this.Layers[layerCount].Layer.LegendInfo.UniqueRenderer = {};
                                            this.Layers[layerCount].Layer.LegendInfo.UniqueRenderer.FieldName = layerInfo.drawingInfo.renderer.field1;
                                            this.Layers[layerCount].Layer.LegendInfo.UniqueRenderer.UniqueValues = [];

                                            //some symbols may reprsent multiple values - loop through legend infos
                                            for (var legendCount = 0; legendCount < legendInfo.length; legendCount++) {
                                                var uv = {};
                                                uv.Label = legendInfo[legendCount].label;
                                                uv.Symbology = legendInfo[legendCount];
                                                this.Layers[layerCount].Layer.LegendInfo.UniqueRenderer.UniqueValues.push(uv);
                                            }
                                            this.Layers[layerCount].Layer.LegendInfo.UniqueRenderer.UniqueValues.sort(function (a, b) {
                                                var textA = a.Label;
                                                var textB = b.Label;
                                                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                                            });


                                            //for (var uniqueCount = 0; uniqueCount < layerInfo.drawingInfo.renderer.uniqueValueInfos.length; uniqueCount++) {
                                            //    var uv = {};
                                            //    uv.Value = layerInfo.drawingInfo.renderer.uniqueValueInfos[uniqueCount].value;
                                            //    uv.Label = layerInfo.drawingInfo.renderer.uniqueValueInfos[uniqueCount].label;
                                            //    uv.Description = layerInfo.drawingInfo.renderer.uniqueValueInfos[uniqueCount].description;
                                            //    for (var legendCount = 0; legendCount < legendInfo.length; legendCount++) {
                                            //        if (legendInfo[legendCount].label == uv.Label) {
                                            //            uv.Symbology = legendInfo[legendCount];
                                            //            break;
                                            //        }
                                            //    }
                                            //    mapLayer.LegendInfo.UniqueRenderer.UniqueValues.push(uv);
                                            //}

                                            //sort by a-z
                                        }
                                        break;
                                    }
                                }


                                //https://firstmap.gis.delaware.gov/arcgis/rest/services/BaseMap/DE_Basemap/MapServer/legend?f=pjson
                                //layers.
                                //  layerId
                                //  layerType
                                //  legend[
                                //      label - join to below request on label
                                //      url
                                //      imageData
                                //      contentType
                                //      height
                                //      width
                                //          values[]
                                //      ]

                                //https://firstmap.gis.delaware.gov/arcgis/rest/services/BaseMap/DE_Basemap/MapServer/2?f=pjson
                                //id
                                //name
                                //description
                                //geometryType
                                //sublayers
                                //drawingInfo
                                //  renderer
                                //      type (uniqueValue or simple)
                                //      field1
                                //      field2
                                //      field3
                                //      uniqueValueInfos[]
                                //          symbol
                                //          value (field value)
                                //          label
                                //          description
                                break;
                            }
                        }
                        break;
                    }
                }
            }





            //find matching layer info
            //find matching legend info

        }

        var gggdd = 554;
    }


    function _loadServices(groupNames, servicesLoaded) {

        //do this in descending order in the way we added them
        for (var x = this.Services.length - 1; x >= 0; x--) {
            this.Services[x].LoadService(serviceLoaded);
        }

        function serviceLoaded(lyr, url) {
            _loadCount++;
            for (var x = 0; x < that.Services.length; x++) {
                (function (x) {
                    if (that.Services[x].Url == url) {
                        that.Services[x].Layer = lyr;
                    }
                })(x);

            }
            if (_loadCount == _serviceCount) {
                servicesLoaded();
            }

        }
    }


    function _loadLayers(groupNames, layersLoaded) {

        //sort based on group, then based on order within group
        groupNames.sort(function (a, b) {
            return b.Order - a.Order
        });

        var sortedLayers = [];
        var loadOrder = 1;
        for (var groupCount = 0; groupCount < groupNames.length; groupCount++) {
            var groupName = groupNames[groupCount].Name;
            var groupLayers = [];
            for (var layerCount = 0; layerCount < this.Layers.length; layerCount++) {
                if (this.Layers[layerCount].GroupName == groupName) {
                    groupLayers.push(this.Layers[layerCount]);
                }
            }

            groupLayers.sort(function (c, d) {
                return d.GroupOrder - c.GroupOrder
            });

            for (var sortCount = 0; sortCount < groupLayers.length; sortCount++) {
                sortedLayers.push(groupLayers[sortCount]);
            }
        }

        for (var sortCount = 0; sortCount < sortedLayers.length; sortCount++) {
            sortedLayers[sortCount].LoadOrder = sortCount + 1;
        }

        that.Layers = sortedLayers;



        for (var x = 0; x < this.Layers.length; x++) {
            this.Layers[x].LoadLayer(layerLoaded);
        }

        function layerLoaded(lyr, url) {
            _loadCount++;
            for (var x = 0; x < that.Layers.length; x++) {
                (function (x) {
                    if (that.Layers[x].Url == url) {
                        that.Layers[x].Layer = lyr;
                    }
                })(x);

            }
            if (_loadCount == _layerCount) {
                layersLoaded();
            }

        }
    }


}