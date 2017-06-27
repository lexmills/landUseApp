var gGeometryServiceUrl = 'https://maps.sussexcountyde.gov/gis/rest/services/Utilities/Geometry/GeometryServer';

var app = {};
app.ParcelSearchConfiguration = null;
app.SearchConfiguration = null;

ConfigureLayers();

app.idResults = null;
app.BasemapGallery = null;
app.IsFirstBasemap = true;
app.PrintServiceUrl = 'https://maps.sussexcountyde.gov/gis/rest/services/Geoprocessing/TemplatePrinting/GPServer/Export%20Web%20Map';
app.ResultCount = 0;
app.selPrintTemplate = null;
app.selPrintFormat = null;
//number of results to display at a time (reduce this if you want to remove scrolling)
app.ResultsPerPage = 5;
app.AllResultsStore = null;
app.SearchInProgressSpinner = null;
//zero-based index of the first result currently displayed
app.ResultsDisplayIndex = 0;



function redirect() {
    window.location = 'http://www.sussexcountyde.gov/sussex-county-mapping-applications';
}



require([
    "esri/map",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/layers/GraphicsLayer",
    "esri/graphic",
    "esri/toolbars/draw",
    "esri/toolbars/navigation",
    "esri/dijit/BasemapGallery",
    "esri/dijit/Scalebar",
    "esri/dijit/OverviewMap",
    "esri/geometry/Extent",
    "esri/SpatialReference",
    "esri/arcgis/utils",
    "esri/tasks/GeometryService",
    "esri/tasks/ProjectParameters",
    "esri/tasks/query",
    "esri/tasks/RelationshipQuery",
     "esri/tasks/QueryTask",
    "esri/geometry/webMercatorUtils",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/Color",
    "esri/geometry/geometryEngine",
        "esri/geometry/geometryEngineAsync",
        "esri/geometry/Point",
        "esri/tasks/PrintTask",
        "esri/tasks/PrintParameters",
        "esri/tasks/PrintTemplate",
        "esri/tasks/locator",
    "esri/tasks/IdentifyTask",
    "esri/tasks/IdentifyParameters",
    "esri/request",
    "dgrid/OnDemandGrid",
    "dgrid/tree",
    "dojo/_base/declare",
    "dojo/promise/all",
    "dojo/store/Memory",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/parser",
    "dijit/registry",
    "dijit/Tooltip",
    "dojo/on",
    "dojo/dom",
    "dijit/layout/ContentPane",
    "dijit/layout/BorderContainer",
    "dijit/layout/TabContainer",
    "dijit/layout/AccordionContainer",
    "dijit/form/ComboBox",
    "dojo/aspect",
    "dojo/_base/lang",
    "dijit/TitlePane",
    "dijit/form/Button",
    "dijit/Dialog",
    "dojo/domReady!"],
    function (esriMap,
        esriDynamicLayer,
        esriGraphicsLayer,
        esriGraphic,
        esriDraw,
        esriNavigation,
        esriBasemapGallery,
        esriScalebar,
        esriOverviewMap,
        esriExtent,
        esriSpatialReference,
        esriUtils,
        esriGeometryService,
        esriProjectParameters,
        esriQuery,
        esriRelationshipQuery,
        esriQueryTask,
        esriWebMercatorUtils,
        esriSimpleMarkerSymbol,
        esriSimpleLineSymbol,
        esriSimpleFillSymbol,
        esriColor,
        esriGeometryEngine,
        esriGeometryEngineAsync,
        esriPoint,
        esriPrintTask,
        esriPrintParameters,
        esriPrintTemplate,
        esriLocator,
        esriIdentifyTask,
        esriIdentifyParameters,
        esriRequest,
        dojoOnDemandGrid,
        dojoTreeGrid,
        dojoDeclare,
        dojoPromiseAll,
        dojoMemoryStore,
        dojoDomStyle,
        dojoDomConstruct,
        dojoArray,
        parser,
        registry,
        dijitTooltip,
        on,
        dom,
        dojoContentPane,
        dojoBorderContainer,
        dojoTabContainer,
        dojoAccordionContainer,
        dojoComboBox,
        dojoAspect,
        dojoLang) {
        parser.parse();


        function InitializeSymbols() {
            app.SearchInProgressSpinner = new Spinner(spinnerOptions);
            //setup symbols
            app.YellowPointSymbol = new esriSimpleMarkerSymbol();
            app.YellowPointSymbol.setColor(new esriColor([255, 255, 0, 0.5]));
            app.YellowPointSymbol.setSize(24);

            app.YellowPolygonSymbol = new esriSimpleFillSymbol(esriSimpleFillSymbol.STYLE_NULL,
                    new esriSimpleLineSymbol(esriSimpleLineSymbol.STYLE_SOLID,
                    new esriColor([255, 0, 0]), 2),
                    new esriColor([255, 255, 0]));
            //app.YellowPolygonSymbol.setStyle(esriSimpleFillSymbol.STYLE_DIAGONAL_CROSS);

            app.BlueSquarePointSymbol = new esriSimpleMarkerSymbol();
            app.BlueSquarePointSymbol.setColor(new esriColor([0, 0, 255, 0.5]));
            app.BlueSquarePointSymbol.setStyle(esriSimpleMarkerSymbol.STYLE_SQUARE);

            app.RedPointSymbol = new esriSimpleMarkerSymbol();
            app.RedPointSymbol.setColor(new esriColor([255, 0, 0, 0.5]));
            app.RedPointSymbol.setStyle(esriSimpleMarkerSymbol.STYLE_SQUARE);

            app.RedLineSymbol = new esriSimpleLineSymbol(esriSimpleLineSymbol.STYLE_SOLID,
                new esriColor([255, 0, 0]), 2);

            app.BlueLineSymbol = new esriSimpleLineSymbol(esriSimpleLineSymbol.STYLE_SOLID,
            new esriColor([0, 0, 255]), 2);

            app.YellowLineSymbol = new esriSimpleLineSymbol(esriSimpleLineSymbol.STYLE_SOLID,
            new esriColor([255, 255, 0]), 2);

            app.GreenPolygonSymbol = new esriSimpleFillSymbol(esriSimpleFillSymbol.STYLE_NULL,
                    new esriSimpleLineSymbol(esriSimpleLineSymbol.STYLE_SOLID,
                    new esriColor([0, 100, 255]), 4),
                    new esriColor([0, 255, 0]));

            app.BluePolygonSymbol = new esriSimpleFillSymbol(esriSimpleFillSymbol.STYLE_NULL,
                    new esriSimpleLineSymbol(esriSimpleLineSymbol.STYLE_SOLID,
                    new esriColor([0, 0, 255]), 4),
                    new esriColor([0, 0, 255]));

            app.YellowPolygonSymbol = new esriSimpleFillSymbol(esriSimpleFillSymbol.STYLE_NULL,
                    new esriSimpleLineSymbol(esriSimpleLineSymbol.STYLE_SOLID,
                    new esriColor([255, 255, 0]), 4),
                    new esriColor([0, 0, 255]));

            //app.BluePolygonSymbol = new esriSimpleFillSymbol(esriSimpleFillSymbol.STYLE_SOLID,
            //        new esriSimpleLineSymbol(esriSimpleLineSymbol.STYLE_SOLID,
            //        new esriColor([255, 0, 0]), 0),
            //        new esriColor([255, 0, 0, 0.5]));
        }

        InitializeSymbols();

        app.selPrintFormat = $("#selPrintFormat");
        app.selPrintTemplate = $("#selPrintTemplate");

        console.log('print template = ' + app.selPrintTemplate);

        $("#spanZoomAll").hide();

        $(document).on("click", "#search", function() {
            if($("#searchBox").css("visibility") == "visible") {
                $("#searchBox").css("visibility", "hidden");
            }
            else {
                $("#searchBox").css("visibility", "visible");
            }

        });

        $(document).on("click", "#layers", function() {
            console.log($("#divLayerVisibility").css("visibility"));
            if($("#divLayerVisibility").css("visibility") == "visible") {
                $("#divLayerVisibility").css("visibility", "hidden");
            }
            else {
                $("#divLayerVisibility").css("visibility", "visible");
            }
        });

        registry.byId("btnMoveToStart").setDisabled(true);
        registry.byId("btnMovePreviousPage").setDisabled(true);
        registry.byId("btnMoveNextPage").setDisabled(true);
        registry.byId("btnMoveToEnd").setDisabled(true);
        registry.byId("btnMovePreviousFeature").setDisabled(true);
        registry.byId("btnMoveNextFeature").setDisabled(true);


        //setup spinner used during searches
        var spinnerOptions = {
            lines: 13, // The number of lines to draw
            length: 20, // The length of each line
            width: 10, // The line thickness
            radius: 30, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#000', // #rgb or #rrggbb or array of colors
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: '50%', // Top position relative to parent
            left: '50%' // Left position relative to parent
        };


        $("#selFieldName").empty();

        for (var x = 0; x < app.ParcelSearchConfiguration.Options.length; x++) {
            $("#selFieldName").append('<option value=' + app.ParcelSearchConfiguration.Options[x].Id + '>' + app.ParcelSearchConfiguration.Options[x].Label + '</option>');
        }

        //comment the following line out to remove the address locator option
        $("#selFieldName").append('<option value=addresslocator>Applicant Name</option>');

        $("#selFieldName").append('<option value=addresslayer>Application Number</option>');

        $("#selFieldName").append('<option value=appyearlayer>Application Year</option>');

        $("#selFieldName").append('<option value=apptypelayer>Application Type</option>');

        app.Map = new esriMap("mapDiv",
            {
                zoom: 13,
                basemap: "topo",
                sliderStyle: "large"
            });

        var scalebar = new esriScalebar({
            map: app.Map,
            scalebarUnit: "english"
        });

        var overviewMap = new esriOverviewMap({
            map: app.Map,
            visible: false
        });
        overviewMap.startup();

        app.BasemapGallery = new esriBasemapGallery({
            showArcGISBasemaps: true,
            map: app.Map
        }, "basemapGallery");
        app.BasemapGallery.startup();
        app.BasemapGallery.on("error", function (e) {
            alert(e);
        });

        function GetArrayIndex(aryToSearch, propName, val) {
            for (var x = 0; x < aryToSearch.length; x++) {
                if (aryToSearch[x][propName] == val) {
                    return x;
                }
            }
            return -1;
        }

        function GetArrayItem(aryToSearch, propName, val) {
            for (var x = 0; x < aryToSearch.length; x++) {
                if (aryToSearch[x][propName] == val) {
                    return aryToSearch[x];
                }
            }
            return null;
        }
        function GetArrayItemString(aryToSearch, propName, val) {
            for (var x = 0; x < aryToSearch.length; x++) {
                if (aryToSearch[x][propName].toUpperCase() == val.toUpperCase()) {
                    return aryToSearch[x];
                }
            }
            return null;
        }


        function formatAttributes(inAtts, layerInfo, fieldsToDisplay, displayField) {
            var outAtts = {};

            if (fieldsToDisplay) {
                //order by fields
                for (var fieldCount = 0; fieldCount < fieldsToDisplay.length; fieldCount++) {
                    var currentFieldName = fieldsToDisplay[fieldCount];
                    if (inAtts[currentFieldName]) {
                        //fieldsToDisplay[fieldCount] = 
                        outAtts[currentFieldName] = inAtts[currentFieldName];
                    }
                }
            }
            else {
                for (attName in inAtts) {
                    if (attName.toUpperCase() != 'OBJECTID' & attName.toUpperCase() != 'SHAPE') {
                        outAtts[attName] = inAtts[attName];
                    }

                }
            }


            //add a displayname attribute
            if (!displayField) {
                var alias = GetArrayItemString(layerInfo.fields, "name", layerInfo.displayField);
                if (alias) {
                    if (inAtts[alias.alias]) {
                        outAtts.AppDisplayName = inAtts[alias.alias];
                    }
                }
            }
            else {
                if (inAtts[displayField]) {
                    outAtts.AppDisplayName = inAtts[displayField];
                }
            }


            return outAtts;
            //layerInfo tells us about field names, types, aliases, etc.
            //fieldsToDisplay is the list of fields the configuation file says to show
        }

        function doIdentify(geom) {
            app.MapDraw.deactivate();
            app.Map.enableMapNavigation();
            app.AllResultsStore = null;
            app.SelectedPolygonGraphicsLayer.clear();
            app.SelectedPointGraphicsLayer.clear();
            app.SelectedLineGraphicsLayer.clear();
            app.ActivePointGraphicsLayer.clear();
            app.ActivePolygonGraphicsLayer.clear();
            app.ActiveLineGraphicsLayer.clear();

            //ClearAccordion();

            app.UpdatingResults = true;
            var acc = registry.byId("divApplicationDetails");
            if (acc.hasChildren()) {
                var kids = acc.getChildren();
                for (var childCount = 0; childCount < kids.length; childCount++) {
                    acc.removeChild(kids[childCount]);
                    dojoDomConstruct.destroy(kids[childCount]);
                }
            }
            app.UpdatingResults = false;



            app.SearchInProgressSpinner.spin(document.getElementById('divApplicationDetails'));

            var layersToSearch = []; //url, layerIds[]
            $("#divLayerVisibility :checked[data-itemtype='identify']").each(function () {
                if ($(this).is(':enabled')) {
                    //checkbox will be disabled if we're outside the visible extent
                    var serviceId = parseInt($(this).attr('data-serviceid'));
                    var subLayerId;
                    if ($(this).attr('data-sublayerid')) {
                        subLayerId = parseInt($(this).attr('data-sublayerid'));
                    }
                    for (var serviceCount = 0; serviceCount < app.MapLayers.Services.length; serviceCount++) {
                        if (app.MapLayers.Services[serviceCount].Id == serviceId) {

                            var currentService = app.MapLayers.Services[serviceCount].Layer;


                            //check if we've added this map server to the list yet
                            var currentIndex = -1;
                            for (var searchCount = 0; searchCount < layersToSearch.length; searchCount++) {
                                if (layersToSearch[searchCount].layerUrl == currentService.url) {
                                    currentIndex = searchCount;
                                    break;
                                }
                            }
                            if (currentIndex == -1) {
                                var searchInfo = {};
                                searchInfo.layerUrl = currentService.url;
                                searchInfo.layerIds = [];
                                searchInfo.layerNames = [];
                                currentIndex = layersToSearch.push(searchInfo) - 1;
                            }
                            var layerName = 'Missing';
                            for (var liCount = 0; liCount < app.MapLayers.Services[serviceCount].Layers.length; liCount++) {
                                if (app.MapLayers.Services[serviceCount].Layers[liCount].LayerId == subLayerId) {
                                    layerName = app.MapLayers.Services[serviceCount].Layers[liCount].Name;
                                    break;
                                }
                            }
                            layersToSearch[currentIndex].layerIds.push(subLayerId);
                            layersToSearch[currentIndex].layerNames.push(layerName);
                            break;
                        }
                    }
                }

            });

            var idTasks = [];
            for (var searchCount = 0; searchCount < layersToSearch.length; searchCount++) {
                var idTask = new esriIdentifyTask(layersToSearch[searchCount].layerUrl);
                var idParams = new esriIdentifyParameters();
                idParams.geometry = geom;
                idParams.layerIds = layersToSearch[searchCount].layerIds;
                idParams.mapExtent = app.Map.extent;
                idParams.layerOption = esriIdentifyParameters.LAYER_OPTION_ALL;
                idParams.tolerance = 1;
                idParams.returnGeometry = true;
                idTasks.push(idTask.execute(idParams));
            }

            promises = dojoPromiseAll(idTasks);
            promises.then(function (idResponses) {
                (function (layersToSearch, idResponses) {
                    var idResults = [];
                    $("#selResultsLayer").empty();
                    var resultsCount = 0;
                    //var layerRequests = [];
                    for (var responseCount = 0; responseCount < idResponses.length; responseCount++) {
                        var serviceResponse = idResponses[responseCount];
                        var currentUrl = layersToSearch[responseCount].layerUrl;
                        for (var featureCount = 0; featureCount < serviceResponse.length; featureCount++) {
                            var featureLayerUrl = layersToSearch[responseCount].layerUrl + '/' + serviceResponse[featureCount].layerId;


                            var layerName;
                            for (var nameCount = 0; nameCount < layersToSearch[responseCount].layerIds.length; nameCount++) {
                                if (layersToSearch[responseCount].layerIds[nameCount] == serviceResponse[featureCount].layerId) {
                                    layerName = layersToSearch[responseCount].layerNames[nameCount];
                                    break;
                                }
                            }
                            //now we need to look for the fields properrt of app.MapLayers.Services[x].Layers
                            var serviceIndex = GetArrayIndex(app.MapLayers.Services, 'Url', currentUrl);
                            var layerIndex = GetArrayIndex(app.MapLayers.Services[serviceIndex].Layers, 'LayerId', serviceResponse[featureCount].layerId);
                            var layerInfo = app.MapLayers.Services[serviceIndex].Layers[layerIndex].LayerInfo;
                            var fields = app.MapLayers.Services[serviceIndex].Layers[layerIndex].Fields;
                            var relationships = app.MapLayers.Services[serviceIndex].Layers[layerIndex].Relationships;
                            //see if we have a results group for this unique layer url yet
                            var existingResultsIndex = -1;
                            for (var existingResultsCount = 0; existingResultsCount < idResults.length; existingResultsCount++) {
                                if (idResults[existingResultsCount].layerUrl == featureLayerUrl) {
                                    existingResultsIndex = existingResultsCount;
                                    break;
                                }
                            }
                            if (existingResultsIndex == -1) {
                                var res = {};
                                res.Fields = fields;
                                res.serviceUrl = currentUrl
                                res.LayerInfo = layerInfo;
                                res.layerUrl = featureLayerUrl;
                                res.relationships = relationships;
                                res.features = [];
                                if (layerName && layerName != 'Missing') {
                                    res.layerName = layerName;
                                }
                                else {
                                    res.layerName = serviceResponse[featureCount].layerName;
                                }

                                existingResultsIndex = idResults.push(res) - 1;
                            }

                            idResults[existingResultsIndex].features.push(serviceResponse[featureCount].feature);
                        }
                    }

                    //loop through results and see if any of them (parcels) need a secondary related query?
                    //if no, callback immediately
                    //if yes, do query then callback after updating attributes
                    var subqueryNeeded = false;
                    for (var resCount = 0; resCount < idResults.length; resCount++) {
                        if (idResults[resCount].relationships) {
                            subqueryNeeded = true;
                            break;
                        }
                    }

                    if (!subqueryNeeded) {
                        //related query not needed
                        idResultsReady(idResults);
                    }
                    else {
                        //make an array of queries (even though one will be needed - this allows up to be flexible if they add more later)
                        var subqueries = [];
                        var queryInfo = [];
                        for (var resCount = 0; resCount < idResults.length; resCount++) {
                            if (idResults[resCount].relationships) {
                                for (var relCount = 0; relCount < idResults[resCount].relationships.length; relCount++) {
                                    var oids = [];
                                    for (var fCount = 0; fCount < idResults[resCount].features.length; fCount++) {
                                        oids.push(parseInt(idResults[resCount].features[fCount].attributes['OBJECTID']));
                                    }
                                    var pk = idResults[resCount].relationships[relCount].PrimaryKeyField;
                                    var fk = idResults[resCount].relationships[relCount].ForeignKeyField;
                                    var fld = GetArrayItem(idResults[resCount].LayerInfo.fields, 'name', pk);
                                    var aliasName = fld.alias;
                                    var subquerytask = new esriQueryTask(idResults[resCount].layerUrl);
                                    var subquery = new esriRelationshipQuery();
                                    subquery.outFields = ["*"];
                                    subquery.objectIds = oids;
                                    subquery.relationshipId = idResults[resCount].relationships[relCount].Id;
                                    subqueries.push(subquerytask.executeRelationshipQuery(subquery));
                                    queryInfo.push(
                                        {
                                            fields: idResults[resCount].relationships[relCount].Fields,
                                            aliasInfo: idResults[resCount].relationships[relCount].FieldInfo,
                                            primaryKey: aliasName,
                                            foreignKey: fk,
                                            url: idResults[resCount].layerUrl,
                                            name: idResults[resCount].relationships[relCount].RelationshipName
                                        });
                                }
                            }
                        }

                        promises = dojoPromiseAll(subqueries);
                        promises.then(function (relResponses) {
                            (function (relResponses, queryInfo, idResults) {
                                //match up the results with the related table info
                                //loop through each results layer in case multiple have relationship
                                for (var resCount = 0; resCount < idResults.length; resCount++) {
                                    var duplicateOwnerFeatures = [];
                                    //because each response doesnt have an id/url associated with it, look through the queryInfo array - the order will be the same as the results
                                    for (var infoCount = 0; infoCount < queryInfo.length; infoCount++) {
                                        //if the layer url matches the url used in the query at this index, we can use it
                                        if (idResults[resCount].layerUrl == queryInfo[infoCount].url) {
                                            //loop through each feature in the results layer
                                            for (fCount = 0; fCount < idResults[resCount].features.length; fCount++) {
                                                //grab the oid
                                                var oid = parseInt(idResults[resCount].features[fCount].attributes['OBJECTID']);
                                                //check to see if the relationship query has an entry for this oid
                                                if (relResponses[infoCount][oid]) {
                                                    //assume that there is a 1-1 relationship
                                                    if (relResponses[infoCount][oid].features.length == 1) {
                                                        //loop through each attribute

                                                        if (queryInfo[infoCount].fields) {
                                                            //fields defined
                                                            var newAtts = {};
                                                            for (var fieldCount = 0; fieldCount < queryInfo[infoCount].fields.length; fieldCount++) {
                                                                var currentField = queryInfo[infoCount].fields[fieldCount];
                                                                if (relResponses[infoCount][oid].features[0].attributes[currentField]) {
                                                                    var aliasItem = GetArrayItem(queryInfo[infoCount].aliasInfo, 'name', currentField);
                                                                    if (aliasItem) {
                                                                        newAtts[aliasItem.alias] = relResponses[infoCount][oid].features[0].attributes[currentField];
                                                                    }
                                                                    else {
                                                                        newAtts[currentField] = relResponses[infoCount][oid].features[0].attributes[currentField];
                                                                    }
                                                                }
                                                            }
                                                            idResults[resCount].features[fCount].setAttributes(newAtts);
                                                        }
                                                        else {
                                                            //fields not definedfor (attName in relResponses[infoCount][oid].features[0].attributes) {
                                                            for (attName in relResponses[infoCount][oid].features[0].attributes) {
                                                                var aliasItem = GetArrayItem(queryInfo[infoCount].aliasInfo, 'name', attName);
                                                                if (aliasItem) {
                                                                    idResults[resCount].features[fCount].attributes[aliasItem.alias] = relResponses[infoCount][oid].features[0].attributes[attName];
                                                                }
                                                                else {
                                                                    idResults[resCount].features[fCount].attributes[attName] = relResponses[infoCount][oid].features[0].attributes[attName];
                                                                }
                                                            }
                                                        }
                                                    }
                                                    else if (relResponses[infoCount][oid].features.length > 1) {
                                                        //multiple records associated with the featutre 


                                                        //update the first feature
                                                        if (queryInfo[infoCount].fields) {
                                                            //fields defined
                                                            var newAtts = {};
                                                            for (var fieldCount = 0; fieldCount < queryInfo[infoCount].fields.length; fieldCount++) {
                                                                var currentField = queryInfo[infoCount].fields[fieldCount];
                                                                if (relResponses[infoCount][oid].features[0].attributes[currentField]) {
                                                                    var aliasItem = GetArrayItem(queryInfo[infoCount].aliasInfo, 'name', currentField);
                                                                    if (aliasItem) {
                                                                        newAtts[aliasItem.alias] = relResponses[infoCount][oid].features[0].attributes[currentField];
                                                                    }
                                                                    else {
                                                                        newAtts[currentField] = relResponses[infoCount][oid].features[0].attributes[currentField];
                                                                    }
                                                                }
                                                            }
                                                            idResults[resCount].features[fCount].setAttributes(newAtts);
                                                        }
                                                        else {
                                                            //fields not definedfor (attName in relResponses[infoCount][oid].features[0].attributes) {
                                                            for (attName in relResponses[infoCount][oid].features[0].attributes) {
                                                                var aliasItem = GetArrayItem(queryInfo[infoCount].aliasInfo, 'name', attName);
                                                                if (aliasItem) {
                                                                    idResults[resCount].features[fCount].attributes[aliasItem.alias] = relResponses[infoCount][oid].features[0].attributes[attName];
                                                                }
                                                                else {
                                                                    idResults[resCount].features[fCount].attributes[attName] = relResponses[infoCount][oid].features[0].attributes[attName];
                                                                }
                                                            }
                                                        }

                                                        //in this case, we need to create a new feature for each record after the first
                                                        for (var recordCount = 1; recordCount < relResponses[infoCount][oid].features.length; recordCount++) {
                                                            var ownerFeature = new esriGraphic(idResults[resCount].features[fCount].geometry);
                                                            var attObj = {};
                                                            //for (var attName in idResults[resCount].features[fCount].attributes) {
                                                            //    attObj[attName] = idResults[resCount].features[fCount].attributes[attName];
                                                            //}
                                                            ownerFeature.setAttributes(attObj);

                                                            if (queryInfo[infoCount].fields) {
                                                                for (var fieldCount = 0; fieldCount < queryInfo[infoCount].fields.length; fieldCount++) {
                                                                    var currentField = queryInfo[infoCount].fields[fieldCount];
                                                                    if (relResponses[infoCount][oid].features[recordCount].attributes[currentField]) {
                                                                        var aliasItem = GetArrayItem(queryInfo[infoCount].aliasInfo, 'name', currentField);
                                                                        if (aliasItem) {
                                                                            ownerFeature.attributes[aliasItem.alias] = relResponses[infoCount][oid].features[recordCount].attributes[currentField];
                                                                        }
                                                                        else {
                                                                            ownerFeature.attributes[currentField] = relResponses[infoCount][oid].features[recordCount].attributes[currentField];
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                            else {
                                                                for (attName in relResponses[infoCount][oid].features[recordCount].attributes) {
                                                                    //if the attribute is in the list of fields we want to display, add it to the attributes of the result feature
                                                                    var aliasItem = GetArrayItem(queryInfo[infoCount].aliasInfo, 'name', attName);
                                                                    if (aliasItem) {
                                                                        ownerFeature.attributes[aliasItem.alias] = relResponses[infoCount][oid].features[recordCount].attributes[attName];
                                                                    }
                                                                    else {
                                                                        ownerFeature.attributes[attName] = relResponses[infoCount][oid].features[recordCount].attributes[attName];
                                                                    }

                                                                }
                                                            }



                                                            duplicateOwnerFeatures.push(ownerFeature);
                                                        }

                                                        var eiff = 44;
                                                    }
                                                }
                                                else {
                                                    //no relationship for the specified OID
                                                    var p = 5;
                                                }
                                            }
                                            for (var y = 0; y < duplicateOwnerFeatures.length; y++) {
                                                idResults[resCount].features.push(duplicateOwnerFeatures[y]);

                                            }
                                            //if (duplicateOwnerFeatures.length > 0) {
                                            var dispName = 'PINWASSEMENTUNIT';
                                            var aliasItem = GetArrayItem(queryInfo[infoCount].aliasInfo, 'name', dispName);
                                            if (aliasItem) {
                                                dispName = aliasItem.alias;
                                            }
                                            idResults[resCount].DisplayField = dispName;
                                            //}


                                            //add new features now?
                                        }
                                    }
                                }
                                idResultsReady(idResults);
                            })(relResponses, queryInfo, idResults);
                        });
                    }




                    //MakeLayerRequests(legendResponse, uniqueLayerUrls);
                })(layersToSearch, idResponses);
            });


            function idResultsReady(idResults) {


                for (var resCount = 0; resCount < idResults.length; resCount++) {
                    var orderItem = GetArrayItem(app.LayerOrder, 'url', idResults[resCount].layerUrl);
                    idResults[resCount].order = orderItem.order;
                }

                idResults.sort(function (a, b) {
                    return a.order - b.order;
                });

                //idResults.sort(function (a, b) {
                //    var textA = a.layerName;
                //    var textB = b.layerName;
                //    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                //});
                var idCount = 1;
                for (var resultCount = 0; resultCount < idResults.length; resultCount++) {
                    idResults[resultCount].id = idCount;

                    //sort these by the proper display name
                    for (var featureCount = 0; featureCount < idResults[resultCount].features.length; featureCount++) {
                        var currentFeature = idResults[resultCount].features[featureCount];
                        idResults[resultCount].features[featureCount].setAttributes(
                            formatAttributes(currentFeature.attributes,
                            idResults[resultCount].LayerInfo,
                            idResults[resultCount].Fields,
                            idResults[resultCount].DisplayField)
                            );
                        idResults[resultCount].features[featureCount].DisplayName = idResults[resultCount].features[featureCount].attributes['AppDisplayName'];
                    }
                    idResults[resultCount].features.sort(function (a, b) {
                        var textA = a.DisplayName;
                        var textB = b.DisplayName;
                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                    });

                    var fCount = 1;
                    for (var featureCount = 0; featureCount < idResults[resultCount].features.length; featureCount++) {
                        idResults[resultCount].features[featureCount].id = fCount;
                        idResults[resultCount].features[featureCount].count = fCount;
                        fCount++;
                    }
                    idCount++;
                }
                NavigationToolbarClicked('btnDeactivate');

                $("#selResultsLayer").removeAttr('disabled');
                $.each(idResults, function (a, b) {
                    var txt = '<option value="' + b.id + '">' + b.layerName + ' (' + b.features.length + ')</option>';
                    $("#selResultsLayer").append(txt);

                });
                $('#selResultsLayer').prop("selectedIndex", 0);

                app.AllResultsStore = new dojoMemoryStore({
                    data: idResults,
                    idProperty: "id"
                });

                app.SearchInProgressSpinner.stop();
                $('#selResultsLayer').change();
            }

        }


        $("#selResultsLayer").on("change", function () {
            var resultsId = parseInt($("#selResultsLayer").val());
            var results = app.AllResultsStore.get(resultsId);
            app.LayerResultsStore = new dojoMemoryStore({
                data: results.features,
                idProperty: "id"
            });
            UpdateResultsGrid(0);
        });


        function UpdateResultsGrid(fromIndex) {



            var toIndex = fromIndex + app.ResultsPerPage;
            //only going up to toIndex -1, so we set the toIndex as the actual length of the array
            if (toIndex > app.LayerResultsStore.data.length - 1) toIndex = app.LayerResultsStore.data.length;
            if (app.LayerResultsStore.data.length > app.ResultsPerPage) {
                //only showing up to toIndex -1
                $("#spanSelectedApplications").html("Selected Features (" + (fromIndex + 1).toString() + " - " + toIndex.toString() + " of " + app.LayerResultsStore.data.length.toString() + ")");
                $("#spanZoomAll").show();
            }
            else {
                $("#spanSelectedApplications").html("Selected Features (" + app.LayerResultsStore.data.length.toString() + ")");
                $("#spanZoomAll").show();
            }

            registry.byId("btnMoveToStart").setDisabled(false);
            registry.byId("btnMovePreviousPage").setDisabled(false);
            registry.byId("btnMoveNextPage").setDisabled(false);
            registry.byId("btnMoveToEnd").setDisabled(false);
            registry.byId("btnMovePreviousFeature").setDisabled(false);
            registry.byId("btnMoveNextFeature").setDisabled(false);

            if (fromIndex == 0) {
                registry.byId("btnMoveToStart").setDisabled(true);
                registry.byId("btnMovePreviousPage").setDisabled(true);
            }
            if (toIndex == app.LayerResultsStore.data.length) {
                registry.byId("btnMoveNextPage").setDisabled(true);
                registry.byId("btnMoveToEnd").setDisabled(true);
            }
            app.ResultsDisplayIndex = fromIndex;

            app.ActivePointGraphicsLayer.clear();
            app.ActivePolygonGraphicsLayer.clear();
            app.ActiveLineGraphicsLayer.clear();
            app.SelectedPointGraphicsLayer.clear();
            app.SelectedPolygonGraphicsLayer.clear();
            app.SelectedLineGraphicsLayer.clear();

            if ((toIndex - fromIndex < 2) && app.ResultsDisplayIndex == 0) {
                //only a single feature
                registry.byId("btnMovePreviousFeature").setDisabled(true);
                registry.byId("btnMoveNextFeature").setDisabled(true);
            }
            for (var resCount = fromIndex; resCount < toIndex; resCount++) {
                var currentFeature = app.LayerResultsStore.data[resCount]
                currentFeature.id = app.ResultCount;
                if (currentFeature.geometry.type == 'point') {
                    var appFeature = new esriGraphic(currentFeature.geometry, app.BlueSquarePointSymbol, { id: currentFeature.id });
                    app.SelectedPointGraphicsLayer.add(appFeature);
                }
                else if (currentFeature.geometry.type == 'polyline') {
                    var appFeature = new esriGraphic(currentFeature.geometry, app.BlueLineSymbol, { id: currentFeature.id });
                    app.SelectedLineGraphicsLayer.add(appFeature);
                }
                else {
                    var appFeature = new esriGraphic(currentFeature.geometry, app.BluePolygonSymbol, { id: currentFeature.id });
                    app.SelectedPolygonGraphicsLayer.add(appFeature);
                }

                app.ResultCount++;
            }
            var acc = registry.byId("divApplicationDetails");
            if (acc.hasChildren()) {
                app.UpdatingResults = true;
                var kids = acc.getChildren();
                for (var childCount = 0; childCount < kids.length; childCount++) {
                    acc.removeChild(kids[childCount]);
                    dojoDomConstruct.destroy(kids[childCount]);
                }
                app.UpdatingResults = false;
            }

            //from app.AllResultsStore, select the features where oid >= fromIndex and < toIndex
            //repopulate the id field with the latest counter (app.ResultsCount)
            var queryResults = app.LayerResultsStore.query(function (obj) {
                return obj.id >= fromIndex & obj.id < toIndex;
            })
            for (var cnt = fromIndex; cnt < toIndex; cnt++) {
                var tableHtml = GetApplicationTableHTML(app.LayerResultsStore.data[cnt].attributes);
                //    var displayName = 'Insert Name Here';
                var displayName = app.LayerResultsStore.data[cnt].attributes['Parcel_ID'];
                if (app.LayerResultsStore.data[cnt].DisplayName) {
                    displayName = app.LayerResultsStore.data[cnt].DisplayName;
                }
                console.log(app.LayerResultsStore.data[cnt].attributes);
                var cp = new dojoContentPane({
                    id: "cp_" + app.LayerResultsStore.data[cnt].id,

                    //title: '<span>' + app.LayerResultsStore.data[cnt].id.toString() + ") " + app.AllResultsStore.data[cnt].number + '     ' + app.AllResultsStore.data[cnt].appAttributes["Application_Type"] + '</span><span style="float:right;margin-right:20px;text-decoration:underline;color:blue;cursor: pointer" onclick="zoomToSelected(' + app.LayerResultsStore.data[cnt].id + ')">Zoom</span>',
                    title: '<span>' + app.LayerResultsStore.data[cnt].count.toString() + ')      ' + displayName + '</span><span style="float:right;margin-right:20px;text-decoration:underline;color:blue;cursor: pointer" onclick="zoomToSelected(' + app.LayerResultsStore.data[cnt].id + ')">Zoom</span>',

                    content: tableHtml,
                    onShow: function () {
                        SelectedApplicationChanged(this.id);
                    }
                });
                acc.addChild(cp);
            }
            acc.startup();

            acc.resize();
        }
        function UpdateLegendByScale() {
            var visibleLayers = app.Map.getLayersVisibleAtScale();
            var currentScale = app.Map.getScale();
            var visLayers = [];
            for (var x = 0; x < app.MapLayers.Services.length; x++) {
                var visLayer = { id: app.MapLayers.Services[x].Id, hiddenLayers: [] };
                for (var y = 0; y < app.MapLayers.Services[x].Layers.length; y++) {
                    var li = app.MapLayers.Services[x].Layers[y].LayerInfo;
                    if (li) {

                    }
                    else {
                        //not everything is loaded - quit for now
                        return false;
                    }

                    if ((li.maxScale != 0 & currentScale < li.maxScale) | (li.minScale != 0 & currentScale > li.minScale)) {
                        visLayer.hiddenLayers.push(li.id);
                    }

                }
                if (visLayer.hiddenLayers.length > 0) {
                    visLayers.push(visLayer);
                }
            }
            $("#divLayerVisibility :checkbox").removeAttr('disabled');
            if (visLayers.length > 0) {
                for (var x = 0; x < visLayers.length; x++) {
                    var serviceId = visLayers[x].id;
                    for (var y = 0; y < visLayers[x].hiddenLayers.length; y++) {
                        var hiddenLayerId = visLayers[x].hiddenLayers[y];
                        $("#divLayerVisibility :checkbox[data-serviceid='" + serviceId + "'][data-sublayerid='" + hiddenLayerId + "']").attr('disabled', 'disabled');
                    }
                }
            }
        }
        app.Map.on("zoom-end", function (zoomArgs) {
            UpdateLegendByScale();
        });



        app.Map.on("load", function (loadArgs) {
            app.MapLayers.LoadServices(app.LayerGroups, function () {
                var ff = 4;
                for (var layerCount = 0; layerCount < app.MapLayers.Services.length; layerCount++) {
                    app.MapLayers.Services[layerCount].ServiceId = app.MapLayers.Services[layerCount].Layer.id;
                }

                app.SearchInProgressSpinner.spin(document.getElementById('divLayerVisibility'));
                RequestServiceLegendInfo(function () {
                    CreateServiceLegend();
                    UpdateLegendByScale();
                    ParseQueryString();

                    //$("#divDisclaimer").dialog({
                    //    title: "Disclaimer",
                    //    width: 300,
                    //    modal: true,
                    //    buttons: {
                    //        "Accept": function () {
                    //            $(this).dialog("close");
                    //        }//,
                    //        //"Decline": function () {
                    //        //    $(this).dialog("close");
                    //        //}
                    //    }
                    //});
                });
            });


            function ParseQueryString() {
                var qs = window.location.search;
                //qs = '?ApplicationId=11204';
                if (qs != '') {
                    var splitString = qs.substring(1).split('=');
                    if (splitString[0] = 'ParcelId') {
                        var pid = splitString[1].toUpperCase();
                        $("#txtSearchValue").val(pid);
                        $("#selFieldName").val('taxid');
                        DoSearch();
                    }
                }
                //else {
                //    dojoDomStyle.set(registry.byId("disclaimer").closeButtonNode, "display", "none");
                //    registry.byId('disclaimer').show();
                //    registry.byId('disclaimer').resize();
                //}
            }

            app.MapDraw = new esriDraw(loadArgs.map, { showTooltips: false });
            app.MapDraw.on("draw-end", function (drawArgs) {
                //handle when user is done drawing, which is actually selecting a feature
                doIdentify(drawArgs.geometry);
            });
            app.Map.on("click", function (evt) {

                //check to see if the event is associated with a graphic layer click
                if (evt.graphic != null) return;
                app.SelectedPolygonGraphicsLayer.clear();
                app.SelectedPointGraphicsLayer.clear();
                app.SelectedLineGraphicsLayer.clear();
                app.ActivePointGraphicsLayer.clear();
                app.ActivePolygonGraphicsLayer.clear();
                app.ActiveLineGraphicsLayer.clear();
                app.AllResultsStore = null;
                app.LayerResultsStore = null;
                ClearAccordion();
                app.SearchInProgressSpinner.spin(document.getElementById('divApplicationDetails'));
                doIdentify(evt.mapPoint);
            });
            //setup navigation
            app.NavToolbar = new esriNavigation(loadArgs.map);
            app.NavToolbar.on("extent-history-change", function () {
                registry.byId('btnZoomPrevious').disabled = app.NavToolbar.isFirstExtent();
                registry.byId('btnZoomNext').disabled = app.NavToolbar.isLastExtent();
            });



            //print

            registry.byId('btnPrint').on("click", function () {
                Print();
            });

            registry.byId('btnZoomIn').on("click", function () {
                NavigationToolbarClicked('btnZoomIn');
            });
            registry.byId('btnZoomOut').on("click", function () {
                NavigationToolbarClicked('btnZoomOut');

            });
            registry.byId('btnZoomFullExtent').on("click", function () {
                if (app.InitialExtent != null) app.Map.setExtent(app.InitialExtent);

            });
            registry.byId('btnZoomPrevious').on("click", function () {
                app.NavToolbar.zoomToPrevExtent();
            });
            registry.byId('btnZoomNext').on("click", function () {
                app.NavToolbar.zoomToNextExtent();
            });
            registry.byId('btnPan').on("click", function () {
                NavigationToolbarClicked('btnPan');

            });
            registry.byId('btnDeactivate').on("click", function () {
                NavigationToolbarClicked('btnDeactivate');
            });

            registry.byId('btnIdentify').on("click", function () {
                NavigationToolbarClicked('btnIdentify');
            });

            registry.byId('btnClearSelected').on("click", function () {
                //clear results
                //clear graphics
                NavigationToolbarClicked('btnDeactivate');
                $("#selResultsLayer").empty();
                $("#selResultsLayer").attr('disabled', 'disabled');
                ClearAccordion();
                app.SelectedPolygonGraphicsLayer.clear();
                app.SelectedPointGraphicsLayer.clear();
                app.SelectedLineGraphicsLayer.clear();
                app.ActivePointGraphicsLayer.clear();
                app.ActivePolygonGraphicsLayer.clear();
                app.ActiveLineGraphicsLayer.clear();
                app.AllResultsStore = null;
                app.LayerResultsStore = null;
                $("#spanSelectedApplications").html("No Applications Selected");
                $("#spanZoomAll").hide();
                //$("#divMoveNext").hide();
            });

            LoadPrintOptions();


            function ClearAccordion() {

                //flag to avoid zooming when removing the accordion items
                app.UpdatingResults = true;
                var acc = registry.byId("divApplicationDetails");
                if (acc.hasChildren()) {
                    var kids = acc.getChildren();
                    for (var childCount = 0; childCount < kids.length; childCount++) {
                        acc.removeChild(kids[childCount]);
                        dojoDomConstruct.destroy(kids[childCount]);
                    }
                }
                app.UpdatingResults = false;
            }

            $("#spanZoomAll").on("click", function () {
                if (app.LayerResultsStore == null) return;
                var zoomGeom = [];
                for (var cnt = 0; cnt < app.LayerResultsStore.data.length; cnt++) {
                    var geom = app.LayerResultsStore.data[cnt].geometry;
                    zoomGeom.push(geom);
                }
                esriGeometryEngineAsync.union(zoomGeom).then(function (res) {
                    app.Map.setExtent(res.getExtent());
                });
            });


            registry.byId("btnMoveToStart").on("click", function () {
                if (app.LayerResultsStore == null) return;
                UpdateResultsGrid(0);
            });
            registry.byId("btnMovePreviousPage").on("click", function () {
                if (app.LayerResultsStore == null) return;
                UpdateResultsGrid(app.ResultsDisplayIndex - app.ResultsPerPage);
            });
            registry.byId("btnMovePreviousFeature").on("click", function () {
                if (app.LayerResultsStore == null) return;
                NavigateFeature(false)
            });
            registry.byId("btnMoveNextFeature").on("click", function () {
                if (app.LayerResultsStore == null) return;
                NavigateFeature(true);
            });
            registry.byId("btnMoveNextPage").on("click", function () {
                if (app.LayerResultsStore == null) return;
                //current from = 0, to = 
                UpdateResultsGrid(app.ResultsDisplayIndex + app.ResultsPerPage);
            });
            registry.byId("btnMoveToEnd").on("click", function () {
                if (app.LayerResultsStore == null) return;
                var rem = app.LayerResultsStore.data.length % app.ResultsPerPage;
                if (rem > 0) {
                    UpdateResultsGrid(app.LayerResultsStore.data.length - rem);
                }
                else {
                    UpdateResultsGrid(app.LayerResultsStore.data.length - app.ResultsPerPage);
                }


            });

            dojoAspect.after(registry.byId("s-bar"), "resize", function () {
                if (app.LayerGrid != null) {
                    app.LayerGrid.resize();
                }
            })



            //Number
            function DoAddressLayerSearch(addressText) {

                /*
                                var abbrevDict = [];
                                abbrevDict.push({ Code: 'ST', Value: 'STREET' });
                                abbrevDict.push({ Code: 'RD', Value: 'ROAD' });
                                abbrevDict.push({ Code: 'DR', Value: 'DRIVE' });
                                abbrevDict.push({ Code: 'AVE', Value: 'AVENUE' });
                                abbrevDict.push({ Code: 'AV', Value: 'AVENUE' });
                                abbrevDict.push({ Code: 'BLVD', Value: 'BOULEVARD' });
                                abbrevDict.push({ Code: 'HWY', Value: 'HIGHWAY' });
                                abbrevDict.push({ Code: 'CT', Value: 'COURT' });
                                abbrevDict.push({ Code: 'WY', Value: 'WAY' });
                                abbrevDict.push({ Code: 'LN', Value: 'LANE' });
                                abbrevDict.push({ Code: 'TR', Value: 'TRAIL' });
                */



                var qt = new esriQueryTask(app.AddressLayerSearchConfiguration.Url);
                var q = new esriQuery();


                var updatedSearch = [];
                var currentString = addressText.toUpperCase().trim();
                //  for (var aryCount = 0; aryCount < splitAry.length; aryCount++) {
                //  var currentString = splitAry[aryCount].toUpperCase().trim();

                //strip out trailing commas, periods
                //  if (currentString[currentString.length - 1] == '.' | currentString[currentString.length - 1] == ',') {
                //       currentString = currentString.substring(0, currentString.length - 1);
                //   }

                //for (var cnt = 0; cnt < abbrevDict.length; cnt++) {
                //    if (currentString == abbrevDict[cnt].Code) {
                //        currentString = abbrevDict[cnt].Value;
                //        break;
                //    }
                //}



                var currentSearchText = "UPPER(" + app.AddressLayerSearchConfiguration.SearchFieldName + ") LIKE '%" + currentString + "%'";
                //     updatedSearch.push(currentSearchText);
                //  }
                //   var newSearch = updatedSearch.join(' AND ');


                q.where = currentSearchText;


                //q.where = "UPPER(" + app.AddressLayerSearchConfiguration.SearchFieldName + ") LIKE '%" + addressText.toUpperCase() + "%'";
                q.outFields = ["Parcel_ID", "Number", "Applicant_Name", "Application_Type", "Hyperlink", "Application_Year"];
                q.outSpatialReference = app.Map.spatialReference;
                q.returnGeometry = true;
                qt.execute(q, function (results) {
                    if (results.features.length == 0) {
                        $("#selResultsLayer").empty();
                        app.SearchInProgressSpinner.stop();
                        alert('No Name Found');
                        return false;
                    }
                    results.features.sort(function (a, b) {
                        var textA = a.attributes[app.AddressLayerSearchConfiguration.SearchFieldName];
                        var textB = b.attributes[app.AddressLayerSearchConfiguration.SearchFieldName];
                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                    })

                    var addressLayerInfo;
                    for (var serviceCount = 0; serviceCount < app.MapLayers.Services.length; serviceCount++) {
                        if (addressLayerInfo) break;
                        if (app.AddressLayerSearchConfiguration.Url.indexOf(app.MapLayers.Services[serviceCount].Url > -1)) {
                            for (var layerCount = 0; layerCount < app.MapLayers.Services[serviceCount].Layers.length; layerCount++) {
                                var layerUrl = app.MapLayers.Services[serviceCount].Url + '/' + app.MapLayers.Services[serviceCount].Layers[layerCount].LayerId;
                                if (layerUrl == app.AddressLayerSearchConfiguration.Url) {
                                    addressLayerInfo = app.MapLayers.Services[serviceCount].Layers[layerCount].LayerInfo;
                                    break;
                                }
                            }
                        }
                    }


                    var idResultsAry = [];
                    var idResults = {};
                    idResults.id = 1;

                    var fCount = 1;

                    for (var featureCount = 0; featureCount < results.features.length; featureCount++) {
                        //       var displayName = results.features[featureCount].attributes['NAME'] + ', ' + results.features[featureCount].attributes['ZN'] + ', ' + results.features[featureCount].attributes['Zip'];;
                        var displayName = results.features[featureCount].attributes['NAME'];;
                        results.features[featureCount].DisplayName = displayName;
                    }
                    for (var featureCount = 0; featureCount < results.features.length; featureCount++) {
                        var currentFeature = results.features[featureCount];
                        results.features[featureCount].id = fCount;
                        results.features[featureCount].count = fCount;
                        if (addressLayerInfo) {
                            var newAtts = [];
                            for (attName in results.features[featureCount].attributes) {
                                if (attName.toUpperCase() != 'OBJECTID' & attName.toUpperCase() != 'SHAPE') {
                                    var alias = GetArrayItemString(addressLayerInfo.fields, "NAME", attName);
                                    if (alias) {
                                        newAtts[alias.alias] = results.features[featureCount].attributes[attName];
                                    }
                                    else {
                                        newAtts[attName] = results.features[featureCount].attributes[attName];
                                    }
                                }
                            }
                            results.features[featureCount].setAttributes(newAtts);
                        }

                        fCount++;
                    }
                    idResults.features = results.features;
                    $("#selResultsLayer").empty();
                    $("#selResultsLayer").removeAttr('disabled');
                    var txt = '<option value="1">Application Number (' + results.features.length + ')</option>';
                    $("#selResultsLayer").append(txt);
                    $('#selResultsLayer').prop("selectedIndex", 0);
                    idResultsAry.push(idResults);
                    app.AllResultsStore = new dojoMemoryStore({
                        data: idResultsAry,
                        idProperty: "id"
                    });

                    app.SearchInProgressSpinner.stop();
                    $('#selResultsLayer').change();

                });
            }


            //Applicant Name
            function DoAddressLocatorSearch(addressText) {
                /*
                 var abbrevDict = [];
                 abbrevDict.push({ Code: 'ST', Value: 'STREET' });
                 abbrevDict.push({ Code: 'RD', Value: 'ROAD' });
                 abbrevDict.push({ Code: 'DR', Value: 'DRIVE' });
                 abbrevDict.push({ Code: 'AVE', Value: 'AVENUE' });
                 abbrevDict.push({ Code: 'AV', Value: 'AVENUE' });
                 abbrevDict.push({ Code: 'BLVD', Value: 'BOULEVARD' });
                 abbrevDict.push({ Code: 'HWY', Value: 'HIGHWAY' });
                 abbrevDict.push({ Code: 'CT', Value: 'COURT' });
                 abbrevDict.push({ Code: 'WY', Value: 'WAY' });
                 abbrevDict.push({ Code: 'LN', Value: 'LANE' });
                 abbrevDict.push({ Code: 'TR', Value: 'TRAIL' });
 */



                var qt = new esriQueryTask(app.AddressLocatorSearchConfiguration.Url);
                var q = new esriQuery();


                var updatedSearch = [];
                var splitAry = addressText.toLowerCase();
                function upperCase(str) {
                    return str.toUpperCase();
                }
                function titleCase(str) {
                    var firstLetterRx = /(^|\s)[a-z]/g;
                    return str.replace(firstLetterRx, upperCase);
                }
                var currentString = titleCase(splitAry);

                var currentSearchText = app.AddressLocatorSearchConfiguration.SearchFieldName + " LIKE '%" + currentString + "%'";
                //   updatedSearch.push(currentSearchText);

                // var newSearch = updatedSearch;


                q.where = currentSearchText;
                console.log(currentSearchText)

                //q.where = "UPPER(" + app.AddressLayerSearchConfiguration.SearchFieldName + ") LIKE '%" + addressText.toUpperCase() + "%'";
                q.outFields = ["Parcel_ID", "Number", "Applicant_Name", "Application_Type", "Hyperlink", "Application_Year"];;
                q.outSpatialReference = app.Map.spatialReference;
                q.returnGeometry = true;
                qt.execute(q, function (results) {
                    if (results.features.length == 0) {
                        $("#selResultsLayer").empty();
                        app.SearchInProgressSpinner.stop();
                        alert('No Name Found');
                        return false;
                    }
                    results.features.sort(function (a, b) {
                        var textA = a.attributes[app.AddressLocatorSearchConfiguration.SearchFieldName];
                        var textB = b.attributes[app.AddressLocatorSearchConfiguration.SearchFieldName];
                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                    })

                    var addressLayerInfo;
                    for (var serviceCount = 0; serviceCount < app.MapLayers.Services.length; serviceCount++) {
                        if (addressLayerInfo) break;
                        if (app.AddressLocatorSearchConfiguration.Url.indexOf(app.MapLayers.Services[serviceCount].Url > -1)) {
                            for (var layerCount = 0; layerCount < app.MapLayers.Services[serviceCount].Layers.length; layerCount++) {
                                var layerUrl = app.MapLayers.Services[serviceCount].Url + '/' + app.MapLayers.Services[serviceCount].Layers[layerCount].LayerId;
                                if (layerUrl == app.AddressLocatorSearchConfiguration.Url) {
                                    addressLayerInfo = app.MapLayers.Services[serviceCount].Layers[layerCount].LayerInfo;
                                    break;
                                }
                            }
                        }
                    }


                    var idResultsAry = [];
                    var idResults = {};
                    idResults.id = 1;

                    var fCount = 1;

                    for (var featureCount = 0; featureCount < results.features.length; featureCount++) {
                        //       var displayName = results.features[featureCount].attributes['NAME'] + ', ' + results.features[featureCount].attributes['ZN'] + ', ' + results.features[featureCount].attributes['Zip'];;
                        var displayName = results.features[featureCount].attributes['NAME'];
                        results.features[featureCount].DisplayName = displayName;
                    }
                    for (var featureCount = 0; featureCount < results.features.length; featureCount++) {
                        var currentFeature = results.features[featureCount];
                        results.features[featureCount].id = fCount;
                        results.features[featureCount].count = fCount;
                        if (addressLayerInfo) {
                            var newAtts = [];
                            for (attName in results.features[featureCount].attributes) {
                                if (attName.toUpperCase() != 'OBJECTID' & attName.toUpperCase() != 'SHAPE') {
                                    var alias = GetArrayItemString(addressLayerInfo.fields, "NAME", attName);
                                    if (alias) {
                                        newAtts[alias.alias] = results.features[featureCount].attributes[attName];
                                    }
                                    else {
                                        newAtts[attName] = results.features[featureCount].attributes[attName];
                                    }
                                }
                            }
                            results.features[featureCount].setAttributes(newAtts);
                        }

                        fCount++;
                    }
                    idResults.features = results.features;
                    $("#selResultsLayer").empty();
                    $("#selResultsLayer").removeAttr('disabled');
                    var txt = '<option value="1">Applicant Name (' + results.features.length + ')</option>';
                    $("#selResultsLayer").append(txt);
                    $('#selResultsLayer').prop("selectedIndex", 0);
                    idResultsAry.push(idResults);
                    app.AllResultsStore = new dojoMemoryStore({
                        data: idResultsAry,
                        idProperty: "id"
                    });

                    app.SearchInProgressSpinner.stop();
                    $('#selResultsLayer').change();

                });
            }








            function DoAppTypeSearch(addressText) {
                /*
                 var abbrevDict = [];
                 abbrevDict.push({ Code: 'ST', Value: 'STREET' });
                 abbrevDict.push({ Code: 'RD', Value: 'ROAD' });
                 abbrevDict.push({ Code: 'DR', Value: 'DRIVE' });
                 abbrevDict.push({ Code: 'AVE', Value: 'AVENUE' });
                 abbrevDict.push({ Code: 'AV', Value: 'AVENUE' });
                 abbrevDict.push({ Code: 'BLVD', Value: 'BOULEVARD' });
                 abbrevDict.push({ Code: 'HWY', Value: 'HIGHWAY' });
                 abbrevDict.push({ Code: 'CT', Value: 'COURT' });
                 abbrevDict.push({ Code: 'WY', Value: 'WAY' });
                 abbrevDict.push({ Code: 'LN', Value: 'LANE' });
                 abbrevDict.push({ Code: 'TR', Value: 'TRAIL' });
 */



                var qt = new esriQueryTask(app.AppTypeLayerSearchConfiguration.Url);
                var q = new esriQuery();


                var updatedSearch = [];
                var splitAry = addressText.toUpperCase().split(' ');
                for (var aryCount = 0; aryCount < splitAry.length; aryCount++) {
                    var currentString = splitAry[aryCount].toUpperCase().trim();

                    //strip out trailing commas, periods
                    if (currentString[currentString.length - 1] == '.' | currentString[currentString.length - 1] == ',') {
                        currentString = currentString.substring(0, currentString.length - 1);
                    }

                    //for (var cnt = 0; cnt < abbrevDict.length; cnt++) {
                    //    if (currentString == abbrevDict[cnt].Code) {
                    //        currentString = abbrevDict[cnt].Value;
                    //        break;
                    //    }
                    //}



                    var currentSearchText = "UPPER(" + app.AppTypeLayerSearchConfiguration.SearchFieldName + ") LIKE '%" + currentString + "%'";
                    updatedSearch.push(currentSearchText);
                }
                var newSearch = updatedSearch.join(' AND ');


                q.where = newSearch;


                //q.where = "UPPER(" + app.AddressLayerSearchConfiguration.SearchFieldName + ") LIKE '%" + addressText.toUpperCase() + "%'";
                q.outFields = ["Parcel_ID", "Number", "Applicant_Name", "Application_Type", "Hyperlink", "Application_Year"];
                q.outSpatialReference = app.Map.spatialReference;
                q.returnGeometry = true;
                qt.execute(q, function (results) {
                    if (results.features.length == 0) {
                        $("#selResultsLayer").empty();
                        app.SearchInProgressSpinner.stop();
                        alert('No Name Found');
                        return false;
                    }
                    results.features.sort(function (a, b) {
                        var textA = a.attributes[app.AppTypeLayerSearchConfiguration.SearchFieldName];
                        var textB = b.attributes[app.AppTypeLayerSearchConfiguration.SearchFieldName];
                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                    })

                    var addressLayerInfo;
                    for (var serviceCount = 0; serviceCount < app.MapLayers.Services.length; serviceCount++) {
                        if (addressLayerInfo) break;
                        if (app.AppTypeLayerSearchConfiguration.Url.indexOf(app.MapLayers.Services[serviceCount].Url > -1)) {
                            for (var layerCount = 0; layerCount < app.MapLayers.Services[serviceCount].Layers.length; layerCount++) {
                                var layerUrl = app.MapLayers.Services[serviceCount].Url + '/' + app.MapLayers.Services[serviceCount].Layers[layerCount].LayerId;
                                if (layerUrl == app.AppTypeLayerSearchConfiguration.Url) {
                                    addressLayerInfo = app.MapLayers.Services[serviceCount].Layers[layerCount].LayerInfo;
                                    break;
                                }
                            }
                        }
                    }


                    var idResultsAry = [];
                    var idResults = {};
                    idResults.id = 1;

                    var fCount = 1;

                    for (var featureCount = 0; featureCount < results.features.length; featureCount++) {
                        //       var displayName = results.features[featureCount].attributes['NAME'] + ', ' + results.features[featureCount].attributes['ZN'] + ', ' + results.features[featureCount].attributes['Zip'];;
                        var displayName = results.features[featureCount].attributes['NAME'];;
                        results.features[featureCount].DisplayName = displayName;
                    }
                    for (var featureCount = 0; featureCount < results.features.length; featureCount++) {
                        var currentFeature = results.features[featureCount];
                        results.features[featureCount].id = fCount;
                        results.features[featureCount].count = fCount;
                        if (addressLayerInfo) {
                            var newAtts = [];
                            for (attName in results.features[featureCount].attributes) {
                                if (attName.toUpperCase() != 'OBJECTID' & attName.toUpperCase() != 'SHAPE') {
                                    var alias = GetArrayItemString(addressLayerInfo.fields, "NAME", attName);
                                    if (alias) {
                                        newAtts[alias.alias] = results.features[featureCount].attributes[attName];
                                    }
                                    else {
                                        newAtts[attName] = results.features[featureCount].attributes[attName];
                                    }
                                }
                            }
                            results.features[featureCount].setAttributes(newAtts);
                        }

                        fCount++;
                    }
                    idResults.features = results.features;
                    $("#selResultsLayer").empty();
                    $("#selResultsLayer").removeAttr('disabled');
                    var txt = '<option value="1">Application Type (' + results.features.length + ')</option>';
                    $("#selResultsLayer").append(txt);
                    $('#selResultsLayer').prop("selectedIndex", 0);
                    idResultsAry.push(idResults);
                    app.AllResultsStore = new dojoMemoryStore({
                        data: idResultsAry,
                        idProperty: "id"
                    });

                    app.SearchInProgressSpinner.stop();
                    $('#selResultsLayer').change();

                });
            }

            function DoAppYearSearch(addressText) {
                /*
                 var abbrevDict = [];
                 abbrevDict.push({ Code: 'ST', Value: 'STREET' });
                 abbrevDict.push({ Code: 'RD', Value: 'ROAD' });
                 abbrevDict.push({ Code: 'DR', Value: 'DRIVE' });
                 abbrevDict.push({ Code: 'AVE', Value: 'AVENUE' });
                 abbrevDict.push({ Code: 'AV', Value: 'AVENUE' });
                 abbrevDict.push({ Code: 'BLVD', Value: 'BOULEVARD' });
                 abbrevDict.push({ Code: 'HWY', Value: 'HIGHWAY' });
                 abbrevDict.push({ Code: 'CT', Value: 'COURT' });
                 abbrevDict.push({ Code: 'WY', Value: 'WAY' });
                 abbrevDict.push({ Code: 'LN', Value: 'LANE' });
                 abbrevDict.push({ Code: 'TR', Value: 'TRAIL' });
 */



                var qt = new esriQueryTask(app.AppYearLayerSearchConfiguration.Url);
                var q = new esriQuery();


                var updatedSearch = [];
                var splitAry = addressText.toUpperCase().split(' ');
                for (var aryCount = 0; aryCount < splitAry.length; aryCount++) {
                    var currentString = splitAry[aryCount].toUpperCase().trim();

                    //strip out trailing commas, periods
                    if (currentString[currentString.length - 1] == '.' | currentString[currentString.length - 1] == ',') {
                        currentString = currentString.substring(0, currentString.length - 1);
                    }

                    //for (var cnt = 0; cnt < abbrevDict.length; cnt++) {
                    //    if (currentString == abbrevDict[cnt].Code) {
                    //        currentString = abbrevDict[cnt].Value;
                    //        break;
                    //    }
                    //}



                    var currentSearchText = app.AppYearLayerSearchConfiguration.SearchFieldName + '=' + currentString;
                    updatedSearch.push(currentSearchText);
                }
                var newSearch = updatedSearch.join(' AND ');


                q.where = newSearch;
                //        console.log(newSearch)

                //q.where = "UPPER(" + app.AddressLayerSearchConfiguration.SearchFieldName + ") LIKE '%" + addressText.toUpperCase() + "%'";
                q.outFields = ["Parcel_ID", "Number", "Applicant_Name", "Application_Type", "Hyperlink", "Application_Year"];

                //		console.log(q.outfields);

                q.outSpatialReference = app.Map.spatialReference;
                q.returnGeometry = true;
                qt.execute(q, function (results) {
                    if (results.features.length == 0) {
                        $("#selResultsLayer").empty();
                        app.SearchInProgressSpinner.stop();
                        alert('No Name Found');
                        return false;
                    }
                    results.features.sort(function (a, b) {
                        var textA = a.attributes[app.AppYearLayerSearchConfiguration.SearchFieldName];
                        var textB = b.attributes[app.AppYearLayerSearchConfiguration.SearchFieldName];
                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                    })

                    var addressLayerInfo;
                    for (var serviceCount = 0; serviceCount < app.MapLayers.Services.length; serviceCount++) {
                        if (addressLayerInfo) break;
                        if (app.AppYearLayerSearchConfiguration.Url.indexOf(app.MapLayers.Services[serviceCount].Url > -1)) {
                            for (var layerCount = 0; layerCount < app.MapLayers.Services[serviceCount].Layers.length; layerCount++) {
                                var layerUrl = app.MapLayers.Services[serviceCount].Url + '/' + app.MapLayers.Services[serviceCount].Layers[layerCount].LayerId;
                                if (layerUrl == app.AppYearLayerSearchConfiguration.Url) {
                                    addressLayerInfo = app.MapLayers.Services[serviceCount].Layers[layerCount].LayerInfo;
                                    break;
                                }
                            }
                        }
                    }


                    var idResultsAry = [];
                    var idResults = {};
                    idResults.id = 1;

                    var fCount = 1;

                    for (var featureCount = 0; featureCount < results.features.length; featureCount++) {
                        //       var displayName = results.features[featureCount].attributes['NAME'] + ', ' + results.features[featureCount].attributes['ZN'] + ', ' + results.features[featureCount].attributes['Zip'];;
                        var displayName = results.features[featureCount].attributes['NAME'];;
                        results.features[featureCount].DisplayName = displayName;
                    }
                    for (var featureCount = 0; featureCount < results.features.length; featureCount++) {
                        var currentFeature = results.features[featureCount];
                        results.features[featureCount].id = fCount;
                        results.features[featureCount].count = fCount;
                        if (addressLayerInfo) {
                            var newAtts = [];
                            for (attName in results.features[featureCount].attributes) {
                                if (attName.toUpperCase() != 'OBJECTID' & attName.toUpperCase() != 'SHAPE') {
                                    var alias = GetArrayItemString(addressLayerInfo.fields, "NAME", attName);
                                    if (alias) {
                                        newAtts[alias.alias] = results.features[featureCount].attributes[attName];

                                        console.log(newAtts[alias.alias]);
                                    }
                                    else {
                                        newAtts[attName] = results.features[featureCount].attributes[attName];
                                    }
                                }
                            }
                            results.features[featureCount].setAttributes(newAtts);
                        }

                        fCount++;
                    }
                    idResults.features = results.features;
                    $("#selResultsLayer").empty();
                    $("#selResultsLayer").removeAttr('disabled');
                    var txt = '<option value="1">Application Year (' + results.features.length + ')</option>';
                    $("#selResultsLayer").append(txt);
                    $('#selResultsLayer').prop("selectedIndex", 0);
                    idResultsAry.push(idResults);
                    app.AllResultsStore = new dojoMemoryStore({
                        data: idResultsAry,
                        idProperty: "id"
                    });

                    app.SearchInProgressSpinner.stop();
                    $('#selResultsLayer').change();

                });
            }
            //    var locator = new esriLocator(app.AddressLocatorSearchConfiguration.LocatorUrl);

            //    var address = {};
            //    address[app.AddressLocatorSearchConfiguration.SingleLineFieldName] = addressText;
            //    var options = {
            //        address: address,
            //        outFields: ['*']
            //    };
            //    locator.addressToLocations(options,
            //        function (addressResults) {
            //            var idResultsAry = [];
            //            var idResults = {};
            //            idResults.features = [];
            //            idResults.id = 1;
            //            var fCount = 1;

            //            addressResults.sort(function (a, b) {
            //                return b.score - a.score;
            //            });

            //            if (addressResults.length == 0) {
            //                app.SearchInProgressSpinner.stop();
            //                alert('No Matching Addresses Found');
            //                return false;
            //            }
            //            else {
            //                var addressPoints = [];
            //                for (var addCount = 0; addCount < addressResults.length; addCount++) {
            //                    var addressPoint = new esriGraphic();

            //                    addressPoint.setAttributes(addressResults[addCount].attributes);
            //                    addressPoint.attributes['score'] = addressResults[addCount].score;
            //                    addressPoint.attributes['address'] = addressResults[addCount].address;
            //                    addressPoint.setGeometry(addressResults[addCount].location);
            //                    addressPoints.push(addressPoint);
            //                }
            //                AddressSearchComplete(addressPoints);
            //            }
            //        }
            //    );


            //    function AddressSearchComplete(resultFeatures) {
            //        var idResultsAry = [];
            //        var idResults = {};
            //        idResults.id = 1;

            //        var fCount = 1;

            //        for (var featureCount = 0; featureCount < resultFeatures.length; featureCount++) {
            //            resultFeatures[featureCount].DisplayName = resultFeatures[featureCount].attributes['address'] +
            //                ' (' + resultFeatures[featureCount].attributes['score'] + '%)';
            //        }
            //        for (var featureCount = 0; featureCount < resultFeatures.length; featureCount++) {
            //            var currentFeature = resultFeatures[featureCount];
            //            resultFeatures[featureCount].id = fCount;
            //            resultFeatures[featureCount].count = fCount;
            //            fCount++;
            //        }
            //        idResults.features = resultFeatures;
            //        $("#selResultsLayer").empty();
            //        $("#selResultsLayer").removeAttr('disabled');
            //        var txt = '<option value="1">Addresses (' + resultFeatures.length + ')</option>';
            //        $("#selResultsLayer").append(txt);
            //        $('#selResultsLayer').prop("selectedIndex", 0);
            //        idResultsAry.push(idResults);
            //        app.AllResultsStore = new dojoMemoryStore({
            //            data: idResultsAry,
            //            idProperty: "id"
            //        });

            //        app.SearchInProgressSpinner.stop();
            //        $('#selResultsLayer').change();
            //    }

            //}























            //function DoAddressLayerSearch(addressText) { //Name


            //                var abbrevDict = [];
            //                abbrevDict.push({ Code: 'ST', Value: 'STREET' });
            //                abbrevDict.push({ Code: 'RD', Value: 'ROAD' });
            //                abbrevDict.push({ Code: 'DR', Value: 'DRIVE' });
            //                abbrevDict.push({ Code: 'AVE', Value: 'AVENUE' });
            //                abbrevDict.push({ Code: 'AV', Value: 'AVENUE' });
            //                abbrevDict.push({ Code: 'BLVD', Value: 'BOULEVARD' });
            //                abbrevDict.push({ Code: 'HWY', Value: 'HIGHWAY' });
            //                abbrevDict.push({ Code: 'CT', Value: 'COURT' });
            //                abbrevDict.push({ Code: 'WY', Value: 'WAY' });
            //                abbrevDict.push({ Code: 'LN', Value: 'LANE' });
            //                abbrevDict.push({ Code: 'TR', Value: 'TRAIL' });




            //                var qt = new esriQueryTask(app.AddressLayerSearchConfiguration.Url);
            //                var q = new esriQuery();


            //                var updatedSearch = [];
            //                var splitAry = addressText.toUpperCase().split(' ');
            //                for (var aryCount = 0; aryCount < splitAry.length; aryCount++) {
            //                    var currentString = splitAry[aryCount].toUpperCase().trim();

            //                    //strip out trailing commas, periods
            //                    if (currentString[currentString.length - 1] == '.' | currentString[currentString.length - 1] == ',') {
            //                        currentString = currentString.substring(0, currentString.length - 1);
            //                    }

            //                    //for (var cnt = 0; cnt < abbrevDict.length; cnt++) {
            //                    //    if (currentString == abbrevDict[cnt].Code) {
            //                    //        currentString = abbrevDict[cnt].Value;
            //                    //        break;
            //                    //    }
            //                    //}



            //                    var currentSearchText = "UPPER(" + app.AddressLayerSearchConfiguration.SearchFieldName + ") LIKE '%" + currentString + "%'";
            //                    updatedSearch.push(currentSearchText);
            //                }
            //                var newSearch = updatedSearch.join(' AND ');


            //                q.where = newSearch;


            //                //q.where = "UPPER(" + app.AddressLayerSearchConfiguration.SearchFieldName + ") LIKE '%" + addressText.toUpperCase() + "%'";
            //                q.outFields = ["*"];
            //                q.outSpatialReference = app.Map.spatialReference;
            //                q.returnGeometry = true;
            //                qt.execute(q, function (results) {
            //                    if (results.features.length == 0) {
            //                        $("#selResultsLayer").empty();
            //                        app.SearchInProgressSpinner.stop();
            //                        alert('No Addresses Found');
            //                        return false;
            //                    }
            //                    results.features.sort(function (a, b) {
            //                        var textA = a.attributes[app.AddressLayerSearchConfiguration.SearchFieldName];
            //                        var textB = b.attributes[app.AddressLayerSearchConfiguration.SearchFieldName];
            //                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            //                    })

            //                    var addressLayerInfo;
            //                    for (var serviceCount = 0; serviceCount < app.MapLayers.Services.length; serviceCount++) {
            //                        if (addressLayerInfo) break;
            //                        if (app.AddressLayerSearchConfiguration.Url.indexOf(app.MapLayers.Services[serviceCount].Url > -1)) {
            //                            for (var layerCount = 0; layerCount < app.MapLayers.Services[serviceCount].Layers.length; layerCount++) {
            //                                var layerUrl = app.MapLayers.Services[serviceCount].Url + '/' + app.MapLayers.Services[serviceCount].Layers[layerCount].LayerId;
            //                                if (layerUrl == app.AddressLayerSearchConfiguration.Url) {
            //                                    addressLayerInfo = app.MapLayers.Services[serviceCount].Layers[layerCount].LayerInfo;
            //                                    break;
            //                                }
            //                            }
            //                        }
            //                    }


            //                    var idResultsAry = [];
            //                    var idResults = {};
            //                    idResults.id = 1;

            //                    var fCount = 1;

            //                    for (var featureCount = 0; featureCount < results.features.length; featureCount++) {
            //                        var displayName = results.features[featureCount].attributes['Parcel ID'] + ', ' + results.features[featureCount].attributes['Application Number'];
            //                        results.features[featureCount].DisplayName = displayName;
            //                    }
            //                    for (var featureCount = 0; featureCount < results.features.length; featureCount++) {
            //                        var currentFeature = results.features[featureCount];
            //                        results.features[featureCount].id = fCount;
            //                        results.features[featureCount].count = fCount;
            //                        if (addressLayerInfo) {
            //                            var newAtts = [];
            //                            for (attName in results.features[featureCount].attributes) {
            //                                if (attName.toUpperCase() != 'OBJECTID' & attName.toUpperCase() != 'SHAPE') {
            //                                    var alias = GetArrayItemString(addressLayerInfo.fields, "name", attName);
            //                                    if (alias) {
            //                                        newAtts[alias.alias] = results.features[featureCount].attributes[attName];
            //                                    }
            //                                    else {
            //                                        newAtts[attName] = results.features[featureCount].attributes[attName];
            //                                    }
            //                                }
            //                            }
            //                            results.features[featureCount].setAttributes(newAtts);
            //                        }

            //                        fCount++;
            //                    }
            //                    idResults.features = results.features;
            //                    $("#selResultsLayer").empty();
            //                    $("#selResultsLayer").removeAttr('disabled');
            //                    var txt = '<option value="1">Addresses (' + results.features.length + ')</option>';
            //                    $("#selResultsLayer").append(txt);
            //                    $('#selResultsLayer').prop("selectedIndex", 0);
            //                    idResultsAry.push(idResults);
            //                    app.AllResultsStore = new dojoMemoryStore({
            //                        data: idResultsAry,
            //                        idProperty: "id"
            //                    });

            //                    app.SearchInProgressSpinner.stop();
            //                    $('#selResultsLayer').change();

            //                });
            //}


            //function DoAddressLocatorSearch(addressText) { //Number

            //    var abbrevDict = [];
            //    abbrevDict.push({ Code: 'ST', Value: 'STREET' });
            //    abbrevDict.push({ Code: 'RD', Value: 'ROAD' });
            //    abbrevDict.push({ Code: 'DR', Value: 'DRIVE' });
            //    abbrevDict.push({ Code: 'AVE', Value: 'AVENUE' });
            //    abbrevDict.push({ Code: 'AV', Value: 'AVENUE' });
            //    abbrevDict.push({ Code: 'BLVD', Value: 'BOULEVARD' });
            //    abbrevDict.push({ Code: 'HWY', Value: 'HIGHWAY' });
            //    abbrevDict.push({ Code: 'CT', Value: 'COURT' });
            //    abbrevDict.push({ Code: 'WY', Value: 'WAY' });
            //    abbrevDict.push({ Code: 'LN', Value: 'LANE' });
            //    abbrevDict.push({ Code: 'TR', Value: 'TRAIL' });




            //    var qt = new esriQueryTask(app.AddressLocatorSearchConfiguration.Url);
            //    var q = new esriQuery();


            //    var updatedSearch = [];
            //    var splitAry = addressText.toUpperCase().trim();
            //    for (var aryCount = 0; aryCount < splitAry.length; aryCount++) {
            //        var currentString = splitAry[aryCount].toUpperCase();

            //        //strip out trailing commas, periods
            //        if (currentString[currentString.length - 1] == '.' | currentString[currentString.length - 1] == ',') {
            //            currentString = currentString.substring(0, currentString.length - 1);
            //        }

            //        //for (var cnt = 0; cnt < abbrevDict.length; cnt++) {
            //        //    if (currentString == abbrevDict[cnt].Code) {
            //        //        currentString = abbrevDict[cnt].Value;
            //        //        break;
            //        //    }
            //        //}



            //        var currentSearchText = "UPPER(" + app.AddressLocatorSearchConfiguration.SearchFieldName + ") LIKE '%" + splitAry + "%'";
            //        updatedSearch.push(currentSearchText);
            //    }
            // //   var newSearch = updatedSearch.join(' AND ');


            //    q.where = updatedSearch;


            //    //q.where = "UPPER(" + app.AddressLayerSearchConfiguration.SearchFieldName + ") LIKE '%" + addressText.toUpperCase() + "%'";
            //    q.outFields = ["*"];
            //    q.outSpatialReference = app.Map.spatialReference;
            //    q.returnGeometry = true;
            //    qt.execute(q, function (results) {
            //        if (results.features.length == 0) {
            //            $("#selResultsLayer").empty();
            //            app.SearchInProgressSpinner.stop();
            //            alert('No Applications Found');
            //            return false;
            //        }
            //        results.features.sort(function (a, b) {
            //            var textA = a.attributes[app.AddressLocatorSearchConfiguration.SearchFieldName];
            //            var textB = b.attributes[app.AddressLocatorSearchConfiguration.SearchFieldName];
            //            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            //        })

            //        var addressLayerInfo;
            //        for (var serviceCount = 0; serviceCount < app.MapLayers.Services.length; serviceCount++) {
            //            if (addressLayerInfo) break;
            //            if (app.AddressLocatorSearchConfiguration.Url.indexOf(app.MapLayers.Services[serviceCount].Url > -1)) {
            //                for (var layerCount = 0; layerCount < app.MapLayers.Services[serviceCount].Layers.length; layerCount++) {
            //                    var layerUrl = app.MapLayers.Services[serviceCount].Url + '/' + app.MapLayers.Services[serviceCount].Layers[layerCount].LayerId;
            //                    if (layerUrl == app.AddressLocatorSearchConfiguration.Url) {
            //                        addressLayerInfo = app.MapLayers.Services[serviceCount].Layers[layerCount].LayerInfo;
            //                        break;
            //                    }
            //                }
            //            }
            //        }


            //        var idResultsAry = [];
            //        var idResults = {};
            //        idResults.id = 1;

            //        var fCount = 1;

            //        for (var featureCount = 0; featureCount < results.features.length; featureCount++) {
            //            var displayName = results.features[featureCount].attributes['Parcel ID'] + ', ' + results.features[featureCount].attributes['Application Number'];;
            //            results.features[featureCount].DisplayName = displayName;
            //        }
            //        for (var featureCount = 0; featureCount < results.features.length; featureCount++) {
            //            var currentFeature = results.features[featureCount];
            //            results.features[featureCount].id = fCount;
            //            results.features[featureCount].count = fCount;
            //            if (addressLayerInfo) {
            //                var newAtts = [];
            //                for (attName in results.features[featureCount].attributes) {
            //                    if (attName.toUpperCase() != 'OBJECTID' & attName.toUpperCase() != 'SHAPE') {
            //                        var alias = GetArrayItemString(addressLayerInfo.fields, "name", attName);
            //                        if (alias) {
            //                            newAtts[alias.alias] = results.features[featureCount].attributes[attName];
            //                        }
            //                        else {
            //                            newAtts[attName] = results.features[featureCount].attributes[attName];
            //                        }
            //                    }
            //                }
            //                results.features[featureCount].setAttributes(newAtts);
            //            }

            //            fCount++;
            //        }
            //        idResults.features = results.features;
            //        $("#selResultsLayer").empty();
            //        $("#selResultsLayer").removeAttr('disabled');
            //        var txt = '<option value="1">Addresses (' + results.features.length + ')</option>';
            //        $("#selResultsLayer").append(txt);
            //        $('#selResultsLayer').prop("selectedIndex", 0);
            //        idResultsAry.push(idResults);
            //        app.AllResultsStore = new dojoMemoryStore({
            //            data: idResultsAry,
            //            idProperty: "id"
            //        });

            //        app.SearchInProgressSpinner.stop();
            //        $('#selResultsLayer').change();

            //    });
            //}
            //                //function DoAddressLocatorSearch(addressText) {

            //                //    var abbrevDict = [];
            //                //    abbrevDict.push({ Code: 'ST', Value: 'STREET' });
            //                //    abbrevDict.push({ Code: 'RD', Value: 'ROAD' });
            //                //    abbrevDict.push({ Code: 'DR', Value: 'DRIVE' });
            //                //    abbrevDict.push({ Code: 'AVE', Value: 'AVENUE' });
            //                //    abbrevDict.push({ Code: 'AV', Value: 'AVENUE' });
            //                //    abbrevDict.push({ Code: 'BLVD', Value: 'BOULEVARD' });
            //                //    abbrevDict.push({ Code: 'HWY', Value: 'HIGHWAY' });
            //                //    abbrevDict.push({ Code: 'CT', Value: 'COURT' });
            //                //    abbrevDict.push({ Code: 'WY', Value: 'WAY' });
            //                //    abbrevDict.push({ Code: 'LN', Value: 'LANE' });
            //                //    abbrevDict.push({ Code: 'TR', Value: 'TRAIL' });




            //                //    var qt = new esriQueryTask(app.AddressLocatorSearchConfiguration.Url);
            //                //    var q = new esriQuery();


            //                //    var updatedSearch = [];
            //                //    var splitAry = addressText.toUpperCase().split(' ');
            //                //    for (var aryCount = 0; aryCount < splitAry.length; aryCount++) {
            //                //        var currentString = splitAry[aryCount].toUpperCase().trim();

            //                //        //strip out trailing commas, periods
            //                //        if (currentString[currentString.length - 1] == '.' | currentString[currentString.length - 1] == ',') {
            //                //            currentString = currentString.substring(0, currentString.length - 1);
            //                //        }

            //                //        //for (var cnt = 0; cnt < abbrevDict.length; cnt++) {
            //                //        //    if (currentString == abbrevDict[cnt].Code) {
            //                //        //        currentString = abbrevDict[cnt].Value;
            //                //        //        break;
            //                //        //    }
            //                //        //}



            //                //        var currentSearchText = "UPPER(" + app.AddressLocatorSearchConfiguration.SearchFieldName + ") LIKE '%" + currentString + "%'";
            //                //        updatedSearch.push(currentSearchText);
            //                //    }
            //                //    var newSearch = updatedSearch.join(' AND ');


            //                //    q.where = newSearch;


            //                //    //q.where = "UPPER(" + app.AddressLayerSearchConfiguration.SearchFieldName + ") LIKE '%" + addressText.toUpperCase() + "%'";
            //                //    q.outFields = ["*"];
            //                //    q.outSpatialReference = app.Map.spatialReference;
            //                //    q.returnGeometry = true;
            //                //    qt.execute(q, function (results) {
            //                //        if (results.features.length == 0) {
            //                //            $("#selResultsLayer").empty();
            //                //            app.SearchInProgressSpinner.stop();
            //                //            alert('No Addresses Found');
            //                //            return false;
            //                //        }
            //                //        results.features.sort(function (a, b) {
            //                //            var textA = a.attributes[app.AddressLocatorSearchConfiguration.SearchFieldName];
            //                //            var textB = b.attributes[app.AddressLocatorSearchConfiguration.SearchFieldName];
            //                //            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            //                //        })

            //                //        var addressLayerInfo;
            //                //        for (var serviceCount = 0; serviceCount < app.MapLayers.Services.length; serviceCount++) {
            //                //            if (addressLayerInfo) break;
            //                //            if (app.AddressLocatorSearchConfiguration.Url.indexOf(app.MapLayers.Services[serviceCount].Url > -1)) {
            //                //                for (var layerCount = 0; layerCount < app.MapLayers.Services[serviceCount].Layers.length; layerCount++) {
            //                //                    var layerUrl = app.MapLayers.Services[serviceCount].Url + '/' + app.MapLayers.Services[serviceCount].Layers[layerCount].LayerId;
            //                //                    if (layerUrl == app.AddressLocatorSearchConfiguration.Url) {
            //                //                        addressLayerInfo = app.MapLayers.Services[serviceCount].Layers[layerCount].LayerInfo;
            //                //                        break;
            //                //                    }
            //                //                }
            //                //            }
            //                //        }


            //                //        var idResultsAry = [];
            //                //        var idResults = {};
            //                //        idResults.id = 1;

            //                //        var fCount = 1;

            //                //        for (var featureCount = 0; featureCount < results.features.length; featureCount++) {
            //                //            var displayName = results.features[featureCount].attributes['Parcel ID'] + ', ' + results.features[featureCount].attributes['Application Number'];;
            //                //            results.features[featureCount].DisplayName = displayName;
            //                //        }
            //                //        for (var featureCount = 0; featureCount < results.features.length; featureCount++) {
            //                //            var currentFeature = results.features[featureCount];
            //                //            results.features[featureCount].id = fCount;
            //                //            results.features[featureCount].count = fCount;
            //                //            if (addressLayerInfo) {
            //                //                var newAtts = [];
            //                //                for (attName in results.features[featureCount].attributes) {
            //                //                    if (attName.toUpperCase() != 'OBJECTID' & attName.toUpperCase() != 'SHAPE') {
            //                //                        var alias = GetArrayItemString(addressLayerInfo.fields, "name", attName);
            //                //                        if (alias) {
            //                //                            newAtts[alias.alias] = results.features[featureCount].attributes[attName];
            //                //                        }
            //                //                        else {
            //                //                            newAtts[attName] = results.features[featureCount].attributes[attName];
            //                //                        }
            //                //                    }
            //                //                }
            //                //                results.features[featureCount].setAttributes(newAtts);
            //                //            }

            //                //            fCount++;
            //                //        }
            //                //        idResults.features = results.features;
            //                //        $("#selResultsLayer").empty();
            //                //        $("#selResultsLayer").removeAttr('disabled');
            //                //        var txt = '<option value="1">Addresses (' + results.features.length + ')</option>';
            //                //        $("#selResultsLayer").append(txt);
            //                //        $('#selResultsLayer').prop("selectedIndex", 0);
            //                //        idResultsAry.push(idResults);
            //                //        app.AllResultsStore = new dojoMemoryStore({
            //                //            data: idResultsAry,
            //                //            idProperty: "id"
            //                //        });

            //                //        app.SearchInProgressSpinner.stop();
            //                //        $('#selResultsLayer').change();

            //                //    });


            //                function DoAppYearSearch(addressText) {

            //                    var abbrevDict = [];
            //                    abbrevDict.push({ Code: 'ST', Value: 'STREET' });
            //                    abbrevDict.push({ Code: 'RD', Value: 'ROAD' });
            //                    abbrevDict.push({ Code: 'DR', Value: 'DRIVE' });
            //                    abbrevDict.push({ Code: 'AVE', Value: 'AVENUE' });
            //                    abbrevDict.push({ Code: 'AV', Value: 'AVENUE' });
            //                    abbrevDict.push({ Code: 'BLVD', Value: 'BOULEVARD' });
            //                    abbrevDict.push({ Code: 'HWY', Value: 'HIGHWAY' });
            //                    abbrevDict.push({ Code: 'CT', Value: 'COURT' });
            //                    abbrevDict.push({ Code: 'WY', Value: 'WAY' });
            //                    abbrevDict.push({ Code: 'LN', Value: 'LANE' });
            //                    abbrevDict.push({ Code: 'TR', Value: 'TRAIL' });




            //                    var qt = new esriQueryTask(app.AppYearLayerSearchConfiguration.Url);
            //                    var q = new esriQuery();


            //                    var updatedSearch = [];
            //                    var splitAry = addressText.toUpperCase().split(' ');
            //                    for (var aryCount = 0; aryCount < splitAry.length; aryCount++) {
            //                        var currentString = splitAry[aryCount].toUpperCase().trim();

            //                        //strip out trailing commas, periods
            //                        if (currentString[currentString.length - 1] == '.' | currentString[currentString.length - 1] == ',') {
            //                            currentString = currentString.substring(0, currentString.length - 1);
            //                        }

            //                        //for (var cnt = 0; cnt < abbrevDict.length; cnt++) {
            //                        //    if (currentString == abbrevDict[cnt].Code) {
            //                        //        currentString = abbrevDict[cnt].Value;
            //                        //        break;
            //                        //    }
            //                        //}



            //                        var currentSearchText = "UPPER(" + app.AppYearLayerSearchConfiguration.SearchFieldName + ") LIKE '%" + currentString + "%'";
            //                        updatedSearch.push(currentSearchText);
            //                    }
            //                    var newSearch = updatedSearch.join(' AND ');


            //                    q.where = newSearch;


            //                    //q.where = "UPPER(" + app.AddressLayerSearchConfiguration.SearchFieldName + ") LIKE '%" + addressText.toUpperCase() + "%'";
            //                    q.outFields = ["*"];
            //                    q.outSpatialReference = app.Map.spatialReference;
            //                    q.returnGeometry = true;
            //                    qt.execute(q, function (results) {
            //                        if (results.features.length == 0) {
            //                            $("#selResultsLayer").empty();
            //                            app.SearchInProgressSpinner.stop();
            //                            alert('No Addresses Found');
            //                            return false;
            //                        }
            //                        results.features.sort(function (a, b) {
            //                            var textA = a.attributes[app.AppYearLayerSearchConfiguration.SearchFieldName];
            //                            var textB = b.attributes[app.AppYearLayerSearchConfiguration.SearchFieldName];
            //                            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            //                        })

            //                        var addressLayerInfo;
            //                        for (var serviceCount = 0; serviceCount < app.MapLayers.Services.length; serviceCount++) {
            //                            if (addressLayerInfo) break;
            //                            if (app.AppYearLayerSearchConfiguration.Url.indexOf(app.MapLayers.Services[serviceCount].Url > -1)) {
            //                                for (var layerCount = 0; layerCount < app.MapLayers.Services[serviceCount].Layers.length; layerCount++) {
            //                                    var layerUrl = app.MapLayers.Services[serviceCount].Url + '/' + app.MapLayers.Services[serviceCount].Layers[layerCount].LayerId;
            //                                    if (layerUrl == app.AppYearLayerSearchConfiguration.Url) {
            //                                        addressLayerInfo = app.MapLayers.Services[serviceCount].Layers[layerCount].LayerInfo;
            //                                        break;
            //                                    }
            //                                }
            //                            }
            //                        }


            //                        var idResultsAry = [];
            //                        var idResults = {};
            //                        idResults.id = 1;

            //                        var fCount = 1;

            //                        for (var featureCount = 0; featureCount < results.features.length; featureCount++) {
            //                            var displayName = results.features[featureCount].attributes['Parcel ID'] + ', ' + results.features[featureCount].attributes['Application Number'];;
            //                            results.features[featureCount].DisplayName = displayName;
            //                        }
            //                        for (var featureCount = 0; featureCount < results.features.length; featureCount++) {
            //                            var currentFeature = results.features[featureCount];
            //                            results.features[featureCount].id = fCount;
            //                            results.features[featureCount].count = fCount;
            //                            if (addressLayerInfo) {
            //                                var newAtts = [];
            //                                for (attName in results.features[featureCount].attributes) {
            //                                    if (attName.toUpperCase() != 'OBJECTID' & attName.toUpperCase() != 'SHAPE') {
            //                                        var alias = GetArrayItemString(addressLayerInfo.fields, "name", attName);
            //                                        if (alias) {
            //                                            newAtts[alias.alias] = results.features[featureCount].attributes[attName];
            //                                        }
            //                                        else {
            //                                            newAtts[attName] = results.features[featureCount].attributes[attName];
            //                                        }
            //                                    }
            //                                }
            //                                results.features[featureCount].setAttributes(newAtts);
            //                            }

            //                            fCount++;
            //                        }
            //                        idResults.features = results.features;
            //                        $("#selResultsLayer").empty();
            //                        $("#selResultsLayer").removeAttr('disabled');
            //                        var txt = '<option value="1">Addresses (' + results.features.length + ')</option>';
            //                        $("#selResultsLayer").append(txt);
            //                        $('#selResultsLayer').prop("selectedIndex", 0);
            //                        idResultsAry.push(idResults);
            //                        app.AllResultsStore = new dojoMemoryStore({
            //                            data: idResultsAry,
            //                            idProperty: "id"
            //                        });

            //                        app.SearchInProgressSpinner.stop();
            //                        $('#selResultsLayer').change();

            //                    });
            //                }















            //function DoAppTypeSearch(addressText) {

            //                            var abbrevDict = [];
            //                            abbrevDict.push({ Code: 'ST', Value: 'STREET' });
            //                            abbrevDict.push({ Code: 'RD', Value: 'ROAD' });
            //                            abbrevDict.push({ Code: 'DR', Value: 'DRIVE' });
            //                            abbrevDict.push({ Code: 'AVE', Value: 'AVENUE' });
            //                            abbrevDict.push({ Code: 'AV', Value: 'AVENUE' });
            //                            abbrevDict.push({ Code: 'BLVD', Value: 'BOULEVARD' });
            //                            abbrevDict.push({ Code: 'HWY', Value: 'HIGHWAY' });
            //                            abbrevDict.push({ Code: 'CT', Value: 'COURT' });
            //                            abbrevDict.push({ Code: 'WY', Value: 'WAY' });
            //                            abbrevDict.push({ Code: 'LN', Value: 'LANE' });
            //                            abbrevDict.push({ Code: 'TR', Value: 'TRAIL' });




            //                            var qt = new esriQueryTask(app.AppTypeLayerSearchConfiguration.Url);
            //                            var q = new esriQuery();


            //                            var updatedSearch = [];
            //                            var splitAry = addressText.toUpperCase().split(' ');
            //                            for (var aryCount = 0; aryCount < splitAry.length; aryCount++) {
            //                                var currentString = splitAry[aryCount].toUpperCase().trim();

            //                                //strip out trailing commas, periods
            //                                if (currentString[currentString.length - 1] == '.' | currentString[currentString.length - 1] == ',') {
            //                                    currentString = currentString.substring(0, currentString.length - 1);
            //                                }

            //                                //for (var cnt = 0; cnt < abbrevDict.length; cnt++) {
            //                                //    if (currentString == abbrevDict[cnt].Code) {
            //                                //        currentString = abbrevDict[cnt].Value;
            //                                //        break;
            //                                //    }
            //                                //}



            //                                var currentSearchText = "UPPER(" + app.AppTypeLayerSearchConfiguration.SearchFieldName + ") LIKE '%" + currentString + "%'";
            //                                updatedSearch.push(currentSearchText);
            //                            }
            //                            var newSearch = updatedSearch.join(' AND ');


            //                            q.where = newSearch;


            //                            //q.where = "UPPER(" + app.AddressLayerSearchConfiguration.SearchFieldName + ") LIKE '%" + addressText.toUpperCase() + "%'";
            //                            q.outFields = ["*"];
            //                            q.outSpatialReference = app.Map.spatialReference;
            //                            q.returnGeometry = true;
            //                            qt.execute(q, function (results) {
            //                                if (results.features.length == 0) {
            //                                    $("#selResultsLayer").empty();
            //                                    app.SearchInProgressSpinner.stop();
            //                                    alert('No Addresses Found');
            //                                    return false;
            //                                }
            //                                results.features.sort(function (a, b) {
            //                                    var textA = a.attributes[app.AppTypeLayerSearchConfiguration.SearchFieldName];
            //                                    var textB = b.attributes[app.AppTypeLayerSearchConfiguration.SearchFieldName];
            //                                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            //                                })

            //                                var addressLayerInfo;
            //                                for (var serviceCount = 0; serviceCount < app.MapLayers.Services.length; serviceCount++) {
            //                                    if (addressLayerInfo) break;
            //                                    if (app.AppTypeLayerSearchConfiguration.Url.indexOf(app.MapLayers.Services[serviceCount].Url > -1)) {
            //                                        for (var layerCount = 0; layerCount < app.MapLayers.Services[serviceCount].Layers.length; layerCount++) {
            //                                            var layerUrl = app.MapLayers.Services[serviceCount].Url + '/' + app.MapLayers.Services[serviceCount].Layers[layerCount].LayerId;
            //                                            if (layerUrl == app.AppTypeLayerSearchConfiguration.Url) {
            //                                                addressLayerInfo = app.MapLayers.Services[serviceCount].Layers[layerCount].LayerInfo;
            //                                                break;
            //                                            }
            //                                        }
            //                                    }
            //                                }


            //                                var idResultsAry = [];
            //                                var idResults = {};
            //                                idResults.id = 1;

            //                                var fCount = 1;

            //                                for (var featureCount = 0; featureCount < results.features.length; featureCount++) {
            //                                    var displayName = results.features[featureCount].attributes['Parcel ID'] + ', ' + results.features[featureCount].attributes['Application Number'];;
            //                                    results.features[featureCount].DisplayName = displayName;
            //                                }
            //                                for (var featureCount = 0; featureCount < results.features.length; featureCount++) {
            //                                    var currentFeature = results.features[featureCount];
            //                                    results.features[featureCount].id = fCount;
            //                                    results.features[featureCount].count = fCount;
            //                                    if (addressLayerInfo) {
            //                                        var newAtts = [];
            //                                        for (attName in results.features[featureCount].attributes) {
            //                                            if (attName.toUpperCase() != 'OBJECTID' & attName.toUpperCase() != 'SHAPE') {
            //                                                var alias = GetArrayItemString(addressLayerInfo.fields, "name", attName);
            //                                                if (alias) {
            //                                                    newAtts[alias.alias] = results.features[featureCount].attributes[attName];
            //                                                }
            //                                                else {
            //                                                    newAtts[attName] = results.features[featureCount].attributes[attName];
            //                                                }
            //                                            }
            //                                        }
            //                                        results.features[featureCount].setAttributes(newAtts);
            //                                    }

            //                                    fCount++;
            //                                }
            //                                idResults.features = results.features;
            //                                $("#selResultsLayer").empty();
            //                                $("#selResultsLayer").removeAttr('disabled');
            //                                var txt = '<option value="1">Addresses (' + results.features.length + ')</option>';
            //                                $("#selResultsLayer").append(txt);
            //                                $('#selResultsLayer').prop("selectedIndex", 0);
            //                                idResultsAry.push(idResults);
            //                                app.AllResultsStore = new dojoMemoryStore({
            //                                    data: idResultsAry,
            //                                    idProperty: "id"
            //                                });

            //                                app.SearchInProgressSpinner.stop();
            //                                $('#selResultsLayer').change();

            //                            });
            //                        }



















            //function AddressSearchComplete(resultFeatures) {
            //    var idResultsAry = [];
            //    var idResults = {};
            //    idResults.id = 1;

            //    var fCount = 1;

            //    for (var featureCount = 0; featureCount < resultFeatures.length; featureCount++) {
            //        resultFeatures[featureCount].DisplayName = resultFeatures[featureCount].attributes['address'] +
            //            ' (' + resultFeatures[featureCount].attributes['score'] + '%)';
            //    }
            //    for (var featureCount = 0; featureCount < resultFeatures.length; featureCount++) {
            //        var currentFeature = resultFeatures[featureCount];
            //        resultFeatures[featureCount].id = fCount;
            //        resultFeatures[featureCount].count = fCount;
            //        fCount++;
            //    }
            //    idResults.features = resultFeatures;
            //    $("#selResultsLayer").empty();
            //    $("#selResultsLayer").removeAttr('disabled');
            //    var txt = '<option value="1">Addresses (' + resultFeatures.length + ')</option>';
            //    $("#selResultsLayer").append(txt);
            //    $('#selResultsLayer').prop("selectedIndex", 0);
            //    idResultsAry.push(idResults);
            //    app.AllResultsStore = new dojoMemoryStore({
            //        data: idResultsAry,
            //        idProperty: "id"
            //    });

            //    app.SearchInProgressSpinner.stop();
            //    $('#selResultsLayer').change();
            //}


            function DoSearch() {
                var searchVal = $("#txtSearchValue").val();
                var fieldName = $("#selFieldName").val();
                if (searchVal != null && fieldName != null) {


                    app.MapDraw.deactivate();
                    app.Map.enableMapNavigation();
                    app.AllResultsStore = null;
                    app.LayerResultsStore = null;
                    app.SelectedPolygonGraphicsLayer.clear();
                    app.SelectedPointGraphicsLayer.clear();
                    app.SelectedLineGraphicsLayer.clear();
                    app.ActivePointGraphicsLayer.clear();
                    app.ActivePolygonGraphicsLayer.clear();
                    app.ActiveLineGraphicsLayer.clear();
                    var acc = registry.byId("divApplicationDetails");
                    app.UpdatingResults = true;
                    if (acc.hasChildren()) {
                        var kids = acc.getChildren();
                        for (var childCount = 0; childCount < kids.length; childCount++) {
                            acc.removeChild(kids[childCount]);
                            dojoDomConstruct.destroy(kids[childCount]);
                        }
                    }
                    app.UpdatingResults = false;
                    app.SearchInProgressSpinner.spin(document.getElementById('divApplicationDetails'));

                    if (fieldName == 'addresslocator') {
                        DoAddressLocatorSearch(searchVal);
                        return;
                    }
                    else if (fieldName == 'addresslayer') {
                        DoAddressLayerSearch(searchVal);
                        return;

                    }
                    else if (fieldName == 'apptypelayer') {
                        DoAppTypeSearch(searchVal);
                        return;

                    }
                    else if (fieldName == 'appyearlayer') {
                        DoAppYearSearch(searchVal);
                        return;


                    }
                    else {
                        if (app.ParcelSearchConfiguration.RelatedTableInfo == null) {
                            var aliasRequest = new esriRequest(
                            {
                                url: app.ParcelSearchConfiguration.RelatedTableUrl,
                                content: { f: "json" },
                                handleAs: "json",
                                callbackParamName: "callback"
                            });

                            aliasRequest.then(function (resp) {
                                app.ParcelSearchConfiguration.RelatedTableInfo = resp.fields;
                                StartSearch();
                            });
                        } else {
                            StartSearch();
                        }
                    }




                    function StartSearch() {
                        var fieldName = $("#selFieldName").val();
                        var searchOptions = GetArrayItem(app.ParcelSearchConfiguration.Options, 'Id', fieldName);
                        if (searchOptions.SearchType == 'layer') {
                            SearchLayerFirst(searchOptions, searchVal);
                        }
                        else {
                            //start with table, link back to features
                            SearchTableFirst(searchOptions, searchVal);
                        }
                    }


                    function SearchLayerFirst(searchOptions, searchText, aliases) {

                        //change search text logiv


                        var qt = new esriQueryTask(app.ParcelSearchConfiguration.ParcelLayerUrl);
                        var q = new esriQuery();
                        q.where = "UPPER(" + searchOptions.FieldName + ") LIKE '%" + searchVal.toUpperCase() + "%'";
                        //q.where = newSearch;
                        q.outFields = app.ParcelSearchConfiguration.LayerFields;
                        if (q.outFields.indexOf('OBJECTID') == -1) {
                            q.outFields.push('OBJECTID');
                        }
                        q.outSpatialReference = app.Map.spatialReference;
                        q.returnGeometry = true;
                        qt.execute(q, function (results) {
                            if (results.features.length == 0) {
                                app.SearchInProgressSpinner.stop();
                                // alert('No Parcels Found');
                                return false;
                            }

                            var oids = [];
                            for (var x = 0; x < results.features.length; x++) {
                                oids.push(parseInt(results.features[x].attributes.OBJECTID))
                            }
                            var rq = new esriRelationshipQuery();
                            rq.outFields = ['*'];
                            rq.objectIds = oids;
                            rq.relationshipId = app.ParcelSearchConfiguration.RelationshipId;

                            //find the field/alias info og thr 

                            qt.executeRelationshipQuery(rq, function (relResults) {
                                (function (relResults, results) {
                                    //results are the parcel features
                                    var foundMultiple = false;
                                    var finalResults = [];
                                    for (var resCount = 0; resCount < results.features.length; resCount++) {
                                        var oid = parseInt(results.features[resCount].attributes['OBJECTID']);
                                        if (relResults[oid]) {
                                            for (relCount = 0; relCount < relResults[oid].features.length; relCount++) {
                                                //each related feature
                                                //add table attributes to each parcel feature
                                                if (relCount == 0) {


                                                    //convert the related table record into a feature by assigning it the parcel geometry
                                                    //use attributes

                                                    //we don't want any of the attributes from the parcel poly itself

                                                    //for (var attName in relResults[oid].features[relCount].attributes) {
                                                    //    var aliasItem = GetArrayItem(app.ParcelSearchConfiguration.RelatedTableInfo, 'name', attName);
                                                    //    if (aliasItem) {
                                                    //        newAtts[aliasItem.alias] = relResults[oid].features[relCount].attributes[attName];
                                                    //    }
                                                    //    else {
                                                    //        newAtts[attName] = relResults[oid].features[relCount].attributes[attName];
                                                    //    }
                                                    //}

                                                    var newAtts = {};
                                                    for (var fieldCount = 0; fieldCount < app.ParcelSearchConfiguration.TableFields.length; fieldCount++) {
                                                        var currentField = app.ParcelSearchConfiguration.TableFields[fieldCount];
                                                        var aliasItem = GetArrayItem(app.ParcelSearchConfiguration.RelatedTableInfo, 'name', currentField);
                                                        if (aliasItem) {
                                                            newAtts[aliasItem.alias] = relResults[oid].features[relCount].attributes[currentField]
                                                        }
                                                        else {
                                                            newAtts[currentField] = relResults[oid].features[relCount].attributes[currentField]
                                                        }
                                                    }
                                                    relResults[oid].features[relCount].setAttributes(newAtts);
                                                    relResults[oid].features[relCount].setGeometry(results.features[resCount].geometry);
                                                    finalResults.push(relResults[oid].features[relCount]);
                                                }
                                                else {

                                                    //create a new feature and assign it the related table attributes and parcel geometry
                                                    var attObj = {};
                                                    var ownerPoly = new esriGraphic(results.features[resCount].geometry, null, attObj);
                                                    for (var fieldCount = 0; fieldCount < app.ParcelSearchConfiguration.TableFields.length; fieldCount++) {
                                                        var currentField = app.ParcelSearchConfiguration.TableFields[fieldCount];
                                                        var aliasItem = GetArrayItem(app.ParcelSearchConfiguration.RelatedTableInfo, 'name', currentField);
                                                        if (aliasItem) {
                                                            ownerPoly.attributes[aliasItem.alias] = relResults[oid].features[relCount].attributes[currentField]
                                                        }
                                                        else {
                                                            ownerPoly.attributes[currentField] = relResults[oid].features[relCount].attributes[currentField]
                                                        }
                                                    }
                                                    finalResults.push(ownerPoly);
                                                    foundMultiple = true;
                                                }
                                            }
                                        }
                                    }
                                    //135-15.13-60.00
                                    var dispField = 'PINWASSEMENTUNIT';
                                    var aliasItem = GetArrayItem(app.ParcelSearchConfiguration.RelatedTableInfo, 'name', dispField);
                                    if (aliasItem) {
                                        dispField = aliasItem.alias;
                                    }
                                    parcelSearchComplete(finalResults, dispField);

                                })(relResults, results);
                            }, function (relError) {
                                var sadbear = 5;
                            });

                        }, function (err) {
                            var sadbear = err;
                        });
                    }
                    function SearchTableFirst(searchOptions, searchText, aliases) {

                        var updatedSearch = [];
                        var splitAry = searchText.split(' ');
                        for (var aryCount = 0; aryCount < splitAry.length; aryCount++) {
                            var currentSearchText = "UPPER(" + searchOptions.FieldName + ") LIKE '%" + splitAry[aryCount].toUpperCase() + "%'";
                            updatedSearch.push(currentSearchText);
                        }
                        var newSearch = updatedSearch.join(' AND ');


                        var qt = new esriQueryTask(app.ParcelSearchConfiguration.RelatedTableUrl);
                        var q = new esriQuery();
                        //q.where = "UPPER(" + searchOptions.FieldName + ") LIKE '%" + searchVal.toUpperCase() + "%'";
                        q.where = newSearch;
                        q.outFields = ['*'];
                        qt.execute(q, function (results) {
                            if (results.features.length == 0) {
                                app.SearchInProgressSpinner.stop();
                                // alert('No Parcels Found');
                                return false;
                            }
                            var oids = [];
                            for (var x = 0; x < results.features.length; x++) {
                                oids.push(parseInt(results.features[x].attributes.OBJECTID))
                            }

                            //replace attributes with alias names  -- do this after we find the related records
                            //for (var resCount = 0; resCount < results.features.length; resCount++) {
                            //    var newAtts = {};
                            //    for (var attName in results.features[resCount].attributes) {
                            //        var aliasItem = GetArrayItem(app.ParcelSearchConfiguration.RelatedTableInfo, 'name', attName);
                            //        if (aliasItem) {
                            //            newAtts[aliasItem.alias] = results.features[resCount].attributes[attName];
                            //        }
                            //        else {
                            //            newAtts[attName] = results.features[resCount].attributes[attName];
                            //        }
                            //    }
                            //    results.features[resCount].setAttributes(newAtts);

                            //}

                            var rq = new esriRelationshipQuery();
                            rq.outFields = app.ParcelSearchConfiguration.LayerFields;
                            rq.objectIds = oids;
                            rq.returnGeometry = true;
                            rq.outSpatialReference = app.Map.spatialReference;
                            rq.relationshipId = app.ParcelSearchConfiguration.RelationshipId;
                            qt.executeRelationshipQuery(rq, function (relResults) {
                                (function (relResults, results) {
                                    var foundMultiple = false;
                                    var finalResults = [];
                                    for (var resCount = 0; resCount < results.features.length; resCount++) {
                                        var oid = parseInt(results.features[resCount].attributes['OBJECTID']);
                                        if (relResults[oid]) {




                                            for (relCount = 0; relCount < relResults[oid].features.length; relCount++) {

                                                var newAtts = {};
                                                for (var fieldCount = 0; fieldCount < app.ParcelSearchConfiguration.TableFields.length; fieldCount++) {
                                                    var currentField = app.ParcelSearchConfiguration.TableFields[fieldCount];
                                                    var aliasItem = GetArrayItem(app.ParcelSearchConfiguration.RelatedTableInfo, 'name', currentField);
                                                    if (aliasItem) {
                                                        newAtts[aliasItem.alias] = results.features[resCount].attributes[currentField]
                                                    }
                                                    else {
                                                        newAtts[currentField] = results.features[resCount].attributes[currentField]
                                                    }
                                                }
                                                relResults[oid].features[relCount].setAttributes(newAtts);
                                                finalResults.push(relResults[oid].features[relCount]);
                                            }
                                        }
                                    }
                                    //here we're querying the owner table first, so we should always show assessment unti
                                    var dispField = 'PINWASSEMENTUNIT';
                                    var aliasItem = GetArrayItem(app.ParcelSearchConfiguration.RelatedTableInfo, 'name', dispField);
                                    if (aliasItem) {
                                        dispField = aliasItem.alias;
                                    }
                                    parcelSearchComplete(finalResults, dispField);



                                })(relResults, results);
                            }, function (relError) {
                                alert(relError.message);
                            });
                        }, function (err) {
                            alert(err.message);
                        });
                    }


                }

                function parcelSearchComplete(resultFeatures, displayName) {
                    var idResultsAry = [];
                    var idResults = {};
                    idResults.id = 1;

                    var fCount = 1;

                    for (var featureCount = 0; featureCount < resultFeatures.length; featureCount++) {
                        if (!displayName) resultFeatures[featureCount].DisplayName = resultFeatures[featureCount].attributes['PIN'];
                        else {
                            resultFeatures[featureCount].DisplayName = resultFeatures[featureCount].attributes[displayName];
                        }
                    }
                    resultFeatures.sort(function (a, b) {
                        var textA = a.DisplayName;
                        var textB = b.DisplayName;
                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                    });
                    for (var featureCount = 0; featureCount < resultFeatures.length; featureCount++) {
                        var currentFeature = resultFeatures[featureCount];
                        //resultFeatures.setAttributes(formatAttributes(currentFeature.attributes, idResults[resultCount].LayerInfo, idResults[resultCount].Fields));
                        resultFeatures[featureCount].id = fCount;
                        resultFeatures[featureCount].count = fCount;
                        fCount++;
                    }



                    idResults.features = resultFeatures;
                    if (resultFeatures.length == 1) {
                        app.Map.setExtent(resultFeatures[0].geometry.getExtent());
                    }
                    $("#selResultsLayer").empty();
                    $("#selResultsLayer").removeAttr('disabled');
                    var txt = '<option value="1">Parcels (' + resultFeatures.length + ')</option>';
                    $("#selResultsLayer").append(txt);
                    $('#selResultsLayer').prop("selectedIndex", 0);
                    idResultsAry.push(idResults);
                    app.AllResultsStore = new dojoMemoryStore({
                        data: idResultsAry,
                        idProperty: "id"
                    });

                    app.SearchInProgressSpinner.stop();
                    $('#selResultsLayer').change();

                }
            }
            $('#btnSearch').on("click", function () {
                DoSearch();

            });
        });

        function Print() {
            //need template
            //need format
            var format = $("#selPrintFormat").val();
            var template = $("#selPrintTemplate").val();
            if (format == null || format.toString() == '') {
                alert('Select a Print Format!');
                return false;
            }
            if (template == null || template.toString() == '') {
                alert('Select a Print Template!');
                return false;
            }

            var printParams = new esriPrintParameters();
            printParams.map = app.Map;

            var printTemplate = new esriPrintTemplate();
            printTemplate.format = format;
            printTemplate.layout = template;

            var opts = {};
            opts.titleText = "Custom Layout Text";
            printTemplate.layoutOptions = opts;

            printParams.template = printTemplate;
            registry.byId('btnPrint').set("label", "Printing...");// = "Printing...";
            registry.byId("btnPrint").setDisabled(true);
            var printTask = new esriPrintTask(app.PrintServiceUrl);
            printTask.execute(printParams,
            function (success) {
                var printUrl = success.url;
                registry.byId('btnPrint').set("label", "Print");
                registry.byId("btnPrint").setDisabled(false);
                window.open(printUrl, "_blank");
            },
            function (error) {
                var msg = error.message;
                alert(msg);
                registry.byId('btnPrint').set("label", "Print");
                registry.byId("btnPrint").setDisabled(false);
            }
            );



        }
        function NavigationToolbarClicked(buttonId) {
            app.MapDraw.deactivate();
            app.NavToolbar.deactivate();
            if (buttonId == 'btnIdentify') {
                $("#btnIdentify").css('background-color', 'red');
                $("#btnPan").css('background-color', 'transparent');
                $("#btnZoomIn").css('background-color', 'transparent');
                $("#btnZoomOut").css('background-color', 'transparent');
                app.Map.disableMapNavigation();
                app.MapDraw.activate(esriDraw.RECTANGLE);
            }
            else if (buttonId == 'btnDeactivate') {
                $("#btnIdentify").css('background-color', 'transparent');
                $("#btnPan").css('background-color', 'transparent');
                $("#btnZoomIn").css('background-color', 'transparent');
                $("#btnZoomOut").css('background-color', 'transparent');
                app.Map.enableMapNavigation();
            }
            else if (buttonId == 'btnPan') {
                $("#btnIdentify").css('background-color', 'transparent');
                $("#btnPan").css('background-color', 'red');
                $("#btnZoomIn").css('background-color', 'transparent');
                $("#btnZoomOut").css('background-color', 'transparent');
                app.Map.enableMapNavigation();
                app.NavToolbar.activate(esriNavigation.PAN);
            }
            else if (buttonId == 'btnZoomIn') {
                $("#btnIdentify").css('background-color', 'transparent');
                $("#btnPan").css('background-color', 'transparent');
                $("#btnZoomIn").css('background-color', 'red');
                $("#btnZoomOut").css('background-color', 'transparent');
                app.Map.enableMapNavigation();
                app.NavToolbar.activate(esriNavigation.ZOOM_IN);
            }
            else if (buttonId == 'btnZoomOut') {
                $("#btnIdentify").css('background-color', 'transparent');
                $("#btnPan").css('background-color', 'transparent');
                $("#btnZoomIn").css('background-color', 'transparent');
                $("#btnZoomOut").css('background-color', 'red');
                app.Map.enableMapNavigation();
                app.NavToolbar.activate(esriNavigation.ZOOM_OUT);
            }
        }


        app.SelectedPolygonGraphicsLayer = new esriGraphicsLayer();
        app.Map.addLayer(app.SelectedPolygonGraphicsLayer);
        app.SelectedPolygonGraphicsLayer.on("click", function (evt) {
            if (app.LayerResultsStore == null) return;

            //use count because id is always changed due to the widgit id problem
            var res = app.LayerResultsStore.query(function (x) {
                return x.id == parseInt(evt.graphic.attributes['id']);
            });
            if (res.length == 0) return;

            var acc = registry.byId("divApplicationDetails");
            var child = registry.byId("cp_" + res[0].id.toString());
            acc.selectChild(child, true);
        });

        app.SelectedLineGraphicsLayer = new esriGraphicsLayer();
        app.Map.addLayer(app.SelectedLineGraphicsLayer);
        app.SelectedLineGraphicsLayer.on("click", function (evt) {
            if (app.LayerResultsStore == null) return;
            var res = app.LayerResultsStore.query(function (x) {
                return x.id == parseInt(evt.graphic.attributes['id']);
            });
            if (res.length == 0) return;

            var acc = registry.byId("divApplicationDetails");
            var child = registry.byId("cp_" + res[0].id.toString());
            acc.selectChild(child, true);
        });

        app.SelectedPointGraphicsLayer = new esriGraphicsLayer();
        app.Map.addLayer(app.SelectedPointGraphicsLayer);
        app.SelectedPointGraphicsLayer.on("click", function (evt) {
            if (app.LayerResultsStore == null) return;
            var res = app.LayerResultsStore.query(function (x) {
                return x.id == parseInt(evt.graphic.attributes['id']);
            });
            if (res.length == 0) return;

            var acc = registry.byId("divApplicationDetails");
            var child = registry.byId("cp_" + res[0].id.toString());
            acc.selectChild(child, true);
        });

        app.ActivePolygonGraphicsLayer = new esriGraphicsLayer();
        app.Map.addLayer(app.ActivePolygonGraphicsLayer);

        app.ActiveLineGraphicsLayer = new esriGraphicsLayer();
        app.Map.addLayer(app.ActiveLineGraphicsLayer);

        app.ActivePointGraphicsLayer = new esriGraphicsLayer();
        app.Map.addLayer(app.ActivePointGraphicsLayer);





        function NavigateFeature(moveNext) {
            registry.byId("btnMoveNextFeature").setDisabled(false);
            registry.byId("btnMovePreviousFeature").setDisabled(false);
            var acc = registry.byId("divApplicationDetails");
            if (acc.selectedChildWidget != null) {
                //need to find the smallest and largest
                var small = 0;
                var large = 0;
                var kids = acc.getChildren();
                for (var childCount = 0; childCount < kids.length; childCount++) {
                    var id = kids[childCount].id;
                    var intId = parseInt(id.substring(3));
                    if (childCount == 0) {
                        small = intId;
                        large = intId;
                    }
                    else {
                        if (intId < small) small = intId;
                        if (intId > large) large = intId;
                    }

                }




                var id = parseInt(acc.selectedChildWidget.id.substring(3));
                var child = null;
                if (moveNext) {
                    if (id == large) {

                        //this is the final one in the list - can't go any farther
                        if (app.ResultsDisplayIndex + app.ResultsPerPage >= app.LayerResultsStore.data.length) {
                            registry.byId("btnMoveNextFeature").setDisabled(true);
                            return;
                        }
                        else {

                            UpdateResultsGrid(app.ResultsDisplayIndex + app.ResultsPerPage)
                        }

                        return;
                    }
                    if ((id == large - 1) && (app.ResultsDisplayIndex + app.ResultsPerPage >= app.LayerResultsStore.data.length)) {
                        registry.byId("btnMoveNextFeature").setDisabled(true);
                    }
                    var nextId = id + 1;
                    child = registry.byId("cp_" + nextId.toString());
                    //may be the last feature in the current page

                }
                if (moveNext == false) {
                    if (id == small) {
                        //at the beginning of the list
                        if (app.ResultsDisplayIndex == 0) {
                            registry.byId("btnMovePreviousFeature").setDisabled(true);
                            return;
                        }

                        //moving to the previous set of results
                        UpdateResultsGrid(app.ResultsDisplayIndex - app.ResultsPerPage);

                        //select the bottom accordion since we just moved backwards
                        kids = acc.getChildren();
                        large = -1;
                        for (var childCount = 0; childCount < kids.length; childCount++) {
                            var id = kids[childCount].id;
                            var intId = parseInt(id.substring(3));
                            if (childCount == 0) {
                                large = intId;
                            }
                            else {
                                if (intId > large) large = intId;
                            }
                        }
                        child = registry.byId("cp_" + large.toString());
                        acc.selectChild(child, true);

                        return;
                    }

                    if ((small + 1) == id && app.ResultsDisplayIndex == 0) {
                        registry.byId("btnMovePreviousFeature").setDisabled(true);
                    }


                    var nextId = id - 1;
                    child = registry.byId("cp_" + nextId.toString());
                }
                if (child != null) acc.selectChild(child, true);
            }
        }


        function SelectedApplicationChanged(divId) {

            if (app.UpdatingResults) return;
            //we may be changing the query and have cleared out the results storeActivePolygonGraphicsLayer.add
            if (app.LayerResultsStore == null) return;
            var storeId = parseInt(divId.substring(3))



            var currentFeatures = app.LayerResultsStore.query(function (x) {
                return x.id == storeId;
            });
            var currentFeature = currentFeatures[0];
            app.ActivePolygonGraphicsLayer.clear();
            app.ActivePointGraphicsLayer.clear();
            app.ActiveLineGraphicsLayer.clear();


            if (currentFeature.geometry.type == 'point') {
                var appFeature = new esriGraphic(currentFeature.geometry, app.YellowPointSymbol, { id: currentFeature.id });
                app.ActivePointGraphicsLayer.add(appFeature);
                var newPt = new esriExtent(
                    currentFeature.geometry.x - 100,
                    currentFeature.geometry.y - 100,
                    currentFeature.geometry.x + 100,
                    currentFeature.geometry.y + 100,
                    currentFeature.geometry.spatialReference);
                app.Map.setExtent(newPt.expand(1.5));
            }
            else if (currentFeature.geometry.type == 'polyline') {
                var appFeature = new esriGraphic(currentFeature.geometry, app.YellowLineSymbol, { id: currentFeature.id });
                app.ActiveLineGraphicsLayer.add(appFeature);
                app.Map.setExtent(currentFeature.geometry.getExtent().expand(1.5));
            }
            else if (currentFeature.geometry.type == 'multipoint') {
                var pt = currentFeature.geometry[0];
                var appFeature = new esriGraphic(pt, app.YellowPointSymbol, { id: currentFeature.id });
                app.ActivePointGraphicsLayer.add(appFeature);
                var newPt = new esriExtent(
                    pt.x - 100,
                    pt.y - 100,
                    pt.x + 100,
                    pt + 100,
                    pt.spatialReference);
                app.Map.setExtent(newPt.expand(1.5));
                app.Map.setExtent(currentFeature.geometry.getExtent().expand(1.5));
            }
            else {
                var appFeature = new esriGraphic(currentFeature.geometry, app.YellowPolygonSymbol, { id: currentFeature.id });
                app.ActivePolygonGraphicsLayer.add(appFeature);
                app.Map.setExtent(currentFeature.geometry.getExtent().expand(1.5));
            }
        }

        function GetApplicationTableHTML(appFeature) {

            var idCount = 0;
            var appResults = [];
            for (attName in appFeature) {
                if (attName != 'AppDisplayName') {
                    idCount++;
                    var attEntry = { attributeName: attName, attributeValue: appFeature[attName], id: idCount };
                    appResults.push(attEntry);
                }

            }


            var outHTML = null;
            var outHTML = '<table style="margin: 5px; width: 95%; border-collapse: collapse;">';
            //outHTML += '<tr style="border: 1px solid darkgray">';

            //outHTML += '<td colspan="2" style="padding: 5px;width:150px;font-weight:bold;font-size:14px">Application Details</td></tr>';



            for (var count = 0; count < appResults.length; count++) {
                var attName = appResults[count].attributeName;
                var attValue = appResults[count].attributeValue;
                outHTML += '<tr style="border: 1px solid darkgray">';

                outHTML += '<td style="padding: 5px;width:150px;font-style:italic">';
                outHTML += attName;
                outHTML += "</td>";
                outHTML += '<td style="padding: 5px">';
                if (attValue) {
                    if (attValue.toString().substring(0, 4) == 'http') {
                        //outHTML += '<a href="' + attValue + '" target="_blank">' + attValue + '</a>';
                        outHTML += '<a href="' + attValue + '" target="_blank">Click Here</a>';
                    }
                    else {
                        outHTML += attValue;
                    }
                }



                outHTML += "</td>";
                outHTML += "</tr>";
            }


            //var parcelResults = [];
            //for (attName in parcelFeature) {

            //    if (app.ParcelFields.indexOf(attName) == -1) continue;
            //    var aliasName = attName;
            //    for (var fieldCount = 0; fieldCount < app.ParcelLayerInfo.fields.length; fieldCount++) {
            //        if (app.ParcelLayerInfo.fields[fieldCount].name == attName) {
            //            aliasName = app.ParcelLayerInfo.fields[fieldCount].alias;
            //            break;
            //        }
            //    }
            //    idCount++;
            //    var attEntry = { attributeName: aliasName, attributeValue: parcelFeature[attName], id: idCount };
            //    parcelResults.push(attEntry);
            //}
            //outHTML += '<tr style="border: 1px solid darkgray"><td colspan="2" style="padding: 5px;width:150px;font-size:14px;font-weight:bold">Parcel Details</td></tr>';

            //for (var count = 0; count < parcelResults.length; count++) {
            //    var attName = parcelResults[count].attributeName;
            //    var attValue = parcelResults[count].attributeValue;
            //    outHTML += '<tr style="border: 1px solid darkgray">';

            //    outHTML += '<td style="padding: 5px;width:150px;font-style:italic">';
            //    outHTML += attName;
            //    outHTML += "</td>";
            //    outHTML += '<td style="padding: 5px">';
            //    if (attValue != null && attValue.toString().substring(0, 4) == 'http') {
            //        outHTML += '<a href="' + attValue + '" target="_blank">' + attValue + '</a>';
            //    }
            //    else {
            //        outHTML += attValue;
            //    }
            //    outHTML += "</td>";
            //    outHTML += "</tr>";
            //}
            outHTML += "</table>";

            return outHTML;
        }



        function LoadPrintOptions() {
            var printInfoRequest = new esriRequest(
            {
                url: app.PrintServiceUrl,
                content: { f: "json" },
                handleAs: "json",
                callbackParamName: "callback"
            });

            printInfoRequest.then(function (resp) {
                var templateNames, formatNames;
                templateNames = dojoArray.filter(resp.parameters, function (param, idx) {
                    return param.name == 'Layout_Template';
                });
                formatNames = dojoArray.filter(resp.parameters, function (param, idx) {
                    return param.name == 'Format';
                });
                if (templateNames.length > 0 & formatNames.length > 0) {
                    app.selPrintFormat.empty();
                    app.selPrintTemplate.empty();

                }

                $.each(templateNames[0].choiceList, function (a, b) {
                    var txt = '<option value = "' + b + '">' + b + '</option>';
                    app.selPrintTemplate.append(txt);
                });
                $.each(formatNames[0].choiceList, function (a, b) {
                    var txt = '<option value = "' + b + '">' + b + '</option>';
                    app.selPrintFormat.append(txt);
                });

                var tt = 5;
            })
        }
        function endsWith(str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        }


        function RequestServiceLegendInfo(callback) {
            //sort to figure out the legend urls we'll need
            var uniqueServices = [];
            var layerUrls = [];
            for (var serviceCount = 0; serviceCount < app.MapLayers.Services.length; serviceCount++) {
                uniqueServices.push(app.MapLayers.Services[serviceCount].Url);
                for (var layerCount = 0; layerCount < app.MapLayers.Services[serviceCount].Layers.length; layerCount++) {
                    //add serviceId attribute to each of the child layers
                    app.MapLayers.Services[serviceCount].Layers[layerCount].ServiceId = app.MapLayers.Services[serviceCount].Id;
                    layerUrls.push(app.MapLayers.Services[serviceCount].Url + '/' + app.MapLayers.Services[serviceCount].Layers[layerCount].LayerId);
                }
            }


            MakeLegendRequests(uniqueServices, layerUrls);
            function MakeLegendRequests(services, uniqueLayerUrls) {
                var legendRequests = [];
                for (var cnt = 0; cnt < uniqueServices.length; cnt++) {
                    var legendRequest = new esriRequest({
                        url: uniqueServices[cnt] + '/legend',
                        content: { f: "json" },
                        handleAs: "json",
                        callbackParamName: "callback"
                    })
                    legendRequests.push(legendRequest);
                }

                promises = dojoPromiseAll(legendRequests);
                promises.then(function (legendResponse) {
                    (function (services, legendResponse, uniqueLayerUrls) {
                        var layerRequests = [];
                        for (var responseCount = 0; responseCount < legendResponse.length; responseCount++) {
                            legendResponse[responseCount].Url = services[responseCount];
                        }
                        MakeLayerRequests(legendResponse, uniqueLayerUrls);
                    })(services, legendResponse, uniqueLayerUrls);
                });
            }
            function MakeLayerRequests(legendResponse, urls) {
                var layerRequests = [];
                for (var urlCount = 0; urlCount < urls.length; urlCount++) {
                    var layerRequest = new esriRequest({
                        url: urls[urlCount],
                        content: { f: "json" },
                        handleAs: "json",
                        callbackParamName: "callback"
                    })
                    layerRequests.push(layerRequest);
                }
                promises = dojoPromiseAll(layerRequests);
                promises.then(function (layerResponse) {
                    (function (layerResponse, legendResponse, urls) {
                        for (var cnt = 0; cnt < layerResponse.length; cnt++) {
                            layerResponse[cnt].Url = urls[cnt];
                        }
                        app.MapLayers.PopulateServiceLegendHtml(legendResponse, layerResponse);
                        //app.MapLayers.PopulateLegendHtml(legendResponse, layerResponse);
                        callback();
                    })(layerResponse, legendResponse, urls);
                });

            }
        }
        function RequestLegendInfo(callback) {
            //sort to figure out the legend urls we'll need
            var uniqueServices = [];
            var layerUrls = [];
            for (var layerCount = 0; layerCount < app.MapLayers.Layers.length; layerCount++) {
                var url = app.MapLayers.Layers[layerCount].Layer.url;
                if (endsWith(url.toLowerCase(), 'mapserver')) {
                    //need to find sub layers
                    for (var subLayerCount = 0; subLayerCount < app.MapLayers.Layers[layerCount].Layer.layerInfos.length; subLayerCount++) {
                        url = app.MapLayers.Layers[layerCount].Layer.url + '/' + app.MapLayers.Layers[layerCount].Layer.layerInfos[subLayerCount].id;
                        layerUrls.push(url);
                    }
                }
                else {
                    layerUrls.push(url);
                }

                var index = url.toLowerCase().lastIndexOf('mapserver');
                var layerUrl = url.substring(0, index + 9);
                if (uniqueServices.indexOf(layerUrl) == -1) {
                    uniqueServices.push(layerUrl);
                }
            }


            MakeLegendRequests(uniqueServices, layerUrls);
            function MakeLegendRequests(services, uniqueLayerUrls) {
                var legendRequests = [];
                for (var cnt = 0; cnt < uniqueServices.length; cnt++) {
                    var legendRequest = new esriRequest({
                        url: uniqueServices[cnt] + '/legend',
                        content: { f: "json" },
                        handleAs: "json",
                        callbackParamName: "callback"
                    })
                    legendRequests.push(legendRequest);
                }

                promises = dojoPromiseAll(legendRequests);
                promises.then(function (legendResponse) {
                    (function (services, legendResponse, uniqueLayerUrls) {
                        var layerRequests = [];
                        for (var responseCount = 0; responseCount < legendResponse.length; responseCount++) {
                            legendResponse[responseCount].Url = services[responseCount];
                        }
                        MakeLayerRequests(legendResponse, uniqueLayerUrls);
                    })(services, legendResponse, uniqueLayerUrls);
                });
            }
            function MakeLayerRequests(legendResponse, urls) {
                var layerRequests = [];
                for (var urlCount = 0; urlCount < urls.length; urlCount++) {
                    var layerRequest = new esriRequest({
                        url: urls[urlCount],
                        content: { f: "json" },
                        handleAs: "json",
                        callbackParamName: "callback"
                    })
                    layerRequests.push(layerRequest);
                }
                promises = dojoPromiseAll(layerRequests);
                promises.then(function (layerResponse) {
                    (function (layerResponse, legendResponse, urls) {
                        for (var cnt = 0; cnt < layerResponse.length; cnt++) {
                            layerResponse[cnt].Url = urls[cnt];
                        }
                        app.MapLayers.PopulateLegendHtml(legendResponse, layerResponse);
                        callback();
                    })(layerResponse, legendResponse, urls);
                });

            }
        }
        function CreateServiceLegend() {
            //object will have a row for each layer and group header
            //if layer is a group layer, rows will only exist for the sub layers
            app.LayerOrder = [];
            var legendItems = [];
            app.LayerGroups.sort(function (a, b) {
                return a.Order - b.Order
            });

            var itemCount = 1;
            for (var groupCount = 0; groupCount < app.LayerGroups.length; groupCount++) {
                var groupName = app.LayerGroups[groupCount].Name;
                var groupLayers = [];
                for (var serviceCount = 0; serviceCount < app.MapLayers.Services.length; serviceCount++) {
                    for (var layerCount = 0; layerCount < app.MapLayers.Services[serviceCount].Layers.length; layerCount++) {
                        if (app.MapLayers.Services[serviceCount].Layers[layerCount].GroupName == groupName) {
                            groupLayers.push(app.MapLayers.Services[serviceCount].Layers[layerCount]);
                        }
                    }
                }

                groupLayers.sort(function (c, d) {
                    return c.GroupOrder - d.GroupOrder
                });

                var groupHeader = {};
                groupHeader.parentId = 0;
                groupHeader.id = itemCount;
                groupHeader.label = groupName;
                groupHeader.type = 'Group';
                groupHeader.groupId = app.LayerGroups[groupCount].Order;
                itemCount++;
                legendItems.push(groupHeader);

                for (var layerCount = 0; layerCount < groupLayers.length; layerCount++) {
                    var layerItem = {};

                    layerItem = {};
                    layerItem.id = itemCount;
                    layerItem.referenceId = groupLayers[layerCount].ServiceId;
                    layerItem.defaultVisibility = groupLayers[layerCount].Visible;
                    //layerItem.parentLayerUrl = groupLayers[layerCount].LayerInfo.Url;
                    layerItem.url = groupLayers[layerCount].LayerInfo.Url;
                    app.LayerOrder.push(
                        {
                            url: layerItem.url,
                            order: itemCount
                        }
                        );
                    layerItem.parentId = groupHeader.id;
                    layerItem.groupId = groupHeader.groupId;
                    layerItem.subLayerId = groupLayers[layerCount].LayerInfo.id;
                    if (groupLayers[layerCount].Name) {
                        //if layer name is specified in config
                        layerItem.label = groupLayers[layerCount].Name;
                    }
                    else {
                        //if not, use layer name from service
                        layerItem.label = groupLayers[layerCount].LayerInfo.name;
                    }

                    layerItem.labelInfo = groupLayers[layerCount].LegendInfo;
                    layerItem.queryable = groupLayers[layerCount].Queryable;
                    layerItem.type = 'SubLayer';
                    legendItems.push(layerItem);
                    itemCount++;
                }
            }


            var layerStore = new dojoMemoryStore({
                data: legendItems,
                idProperty: "id",
                getChildren: function (parent, options) {
                    return layerStore.query({ parentId: parent.id }, { length: 100 });
                },
                mayHaveChildren: function (parent) {
                    return parent.type == 'Group';
                }
            });
            app.SearchInProgressSpinner.stop();
            var layerGridType = dojoDeclare([dojoOnDemandGrid, dojoTreeGrid]);
            app.LayerGrid = new layerGridType({
                store: layerStore,
                query: function (layer) { return layer.type == 'Group' },
                columns: [
                    dojoTreeGrid({
                        label: "Layer Visibility",
                        formatter: BuildLegendRow,
                        shouldExpand: function (row, level, previouslyExpanded) {
                            return true;

                        },
                        indentWidth: 45
                    })
                ]
            }, "divLayerVisibility");

            //we need these to expand once so the row is built
            $("#divLayerVisibility").hide();
            for (var x = 0; x < app.LayerGrid.store.data.length; x++) {
                var id = app.LayerGrid.store.data[x].id;
                if (app.LayerGrid.store.data[x].type == 'Group') {
                    var row = app.LayerGrid.row(id);
                    //              if (app.LayerGrid.store.data[x].label == 'Addresses/Parcels' || app.LayerGrid.store.data[x].label == 'Zoning') {
                    if (app.LayerGrid.store.data[x].label == '2017 Applications' || app.LayerGrid.store.data[x].label == '2016 Applications') {
                        app.LayerGrid.expand(row, true);
                    }
                    else {

                        app.LayerGrid.expand(row, false);
                    }
                }

            }
            $("#divLayerVisibility").show();

            function BuildLegendRow(evt) {
                //this corresponds to the dGrid indent width above, plus 15px + 10px
                if (evt.label == 'Parcel Labels') {
                    var ttt = 4;
                }
                var indentWidth = 60;
                var imageIndentWidth = 70;
                var htmlText = '<div style="width:100%">';
                if (evt.id != -1) {
                    if (evt.parentId == 0) {
                        //group header
                        htmlText += '<input style="vertical-align:middle" data-itemtype="group" data-groupid="' + evt.groupId + '" type="checkbox" checked/>';
                        htmlText += '<span style="margin-left:5px;font-weight:bold;font-size:1.3em">' + evt.label + '</span>';
                        htmlText += '</div>';
                    }
                    else {
                        htmlText += '<input style="vertical-align:middle" data-groupid="' + evt.groupId + '" data-itemtype="layer" data-serviceid="' + evt.referenceId + '" type="checkbox"';
                        if (evt.subLayerId != undefined) {
                            htmlText += ' data-sublayerid="' + evt.subLayerId + '"';
                        }
                        if (evt.defaultVisibility) {
                            htmlText += ' checked';
                        }
                        htmlText += '/>';

                        if (evt.labelInfo != undefined) {
                            if (evt.labelInfo.SimpleRenderer) {
                                var imageHeight = evt.labelInfo.SimpleRenderer.Symbology.height;
                                var imageWidth = evt.labelInfo.SimpleRenderer.Symbology.width;
                                var imageSource = 'data:' + evt.labelInfo.SimpleRenderer.Symbology.contentType + ';base64,' + evt.labelInfo.SimpleRenderer.Symbology.imageData;
                                var imageText = '<img style="margin-left:10px;vertical-align:middle;height:' + imageHeight + 'px;width:' + imageWidth + 'px" src="' + imageSource + '"</img>';
                                htmlText += imageText;
                                htmlText += '<span style="margin-left:5px;vertical-align:middle;font-size:1.3em">' + evt.label + '</span>';

                                if (evt.defaultVisibility) {
                                    if (evt.queryable) {
                                        htmlText += '<div style="float:right"><input style="vertical-align:middle" data-groupid="' + evt.groupId + '" data-itemtype="identify" data-sublayerid="' + evt.subLayerId + '" data-itemtype="identify" data-serviceid="' + evt.referenceId + '" type="checkbox" checked/><span> Id?</span></div>';
                                    }
                                    else {
                                        htmlText += '<div style="float:right"><input style="vertical-align:middle" data-groupid="' + evt.groupId + '" data-itemtype="identify" data-sublayerid="' + evt.subLayerId + '" data-serviceid="' + evt.referenceId + '" type="checkbox"/><span> Id?</span></div>';
                                    }

                                }
                                else {
                                    if (evt.queryable) {
                                        htmlText += '<div style="float:right"><input style="vertical-align:middle" data-groupid="' + evt.groupId + '" data-itemtype="identify" data-sublayerid="' + evt.subLayerId + '" data-serviceid="' + evt.referenceId + '" type="checkbox" checked/><span> Id?</span></div>';
                                    }
                                    else {
                                        htmlText += '<div style="float:right"><input style="vertical-align:middle" data-groupid="' + evt.groupId + '" data-itemtype="identify" data-sublayerid="' + evt.subLayerId + '" data-serviceid="' + evt.referenceId + '" type="checkbox"/><span> Id?</span></div>';
                                    }
                                }

                                htmlText += '</div>';
                            }
                            else if (evt.labelInfo.UniqueRenderer) {
                                //unique
                                htmlText += '<span style="margin-left:15px;vertical-align:middle;font-size:1.3em">' + evt.label + '</span>';
                                if (evt.defaultVisibility) {
                                    if (evt.queryable) {
                                        htmlText += '<div style="float:right"><input style="vertical-align:middle" data-groupid="' + evt.groupId + '" data-itemtype="identify" data-serviceid="' + evt.referenceId + '" data-sublayerid="' + evt.subLayerId + '" type="checkbox" checked/><span> Id?</span></div>';
                                    }
                                    else {
                                        htmlText += '<div style="float:right"><input style="vertical-align:middle" data-groupid="' + evt.groupId + '" data-itemtype="identify" data-sublayerid="' + evt.subLayerId + '" data-serviceid="' + evt.referenceId + '" type="checkbox"/><span> Id?</span></div>';
                                    }

                                }
                                else {
                                    if (evt.queryable) {
                                        htmlText += '<div style="float:right"><input style="vertical-align:middle" data-groupid="' + evt.groupId + '" data-itemtype="identify" data-sublayerid="' + evt.subLayerId + '" data-serviceid="' + evt.referenceId + '" type="checkbox" checked/><span> Id?</span></div>';
                                    }
                                    else {
                                        htmlText += '<div style="float:right"><input style="vertical-align:middle" data-groupid="' + evt.groupId + '" data-itemtype="identify" data-sublayerid="' + evt.subLayerId + '" data-serviceid="' + evt.referenceId + '" type="checkbox"/><span> Id?</span></div>';
                                    }
                                }

                                htmlText += '<div style="margin-left:125px;vertical-align:middle;width:100%;font-style:italic;font-size:1.1em">';
                                htmlText += evt.labelInfo.UniqueRenderer.FieldName;
                                htmlText += '</div>';
                                for (var uniqueCount = 0; uniqueCount < evt.labelInfo.UniqueRenderer.UniqueValues.length; uniqueCount++) {

                                    var uq = evt.labelInfo.UniqueRenderer.UniqueValues[uniqueCount];
                                    htmlText += '<div style="margin-left:' + imageIndentWidth.toString() + 'px;vertical-align:middle;width:100%">';
                                    var imageHeight = uq.Symbology.height;
                                    var imageWidth = uq.Symbology.width;
                                    var imageSource = 'data:' + uq.Symbology.contentType + ';base64,' + uq.Symbology.imageData;
                                    var imageText = '<img style="margin-left:15px;vertical-align:middle;height:' + imageHeight + 'px;width:' + imageWidth + 'px" src="' + imageSource + '"</img>';
                                    htmlText += imageText;
                                    htmlText += '<span style="margin-left:5px;vertical-align:middle">' + uq.Label + '</span>';
                                    htmlText += '</div>';

                                }
                                htmlText += '</div>';
                            }
                            else {
                                //no renderer
                                var tt = evt.labelInfo;
                                htmlText += '<div style="margin-left:' + imageIndentWidth.toString() + 'px;vertical-align:middle;width:100%">';
                                htmlText += '<span style="margin-left:5px;vertical-align:middle;font-size:1.3em">' + evt.label + '</span>';
                                htmlText += '</div>';
                            }
                        }
                        else {
                            var tt = 5;
                            //htmlText += '<div style="margin-left:' + imageIndentWidth.toString() + 'px;vertical-align:middle;width:100%">';
                            htmlText += '<span style="margin-left:10px;vertical-align:middle;font-size:1.3em">' + evt.label + '</span>';
                            htmlText += '</div>';
                        }

                    }
                }

                return htmlText;
            }
            $("#divLayerVisibility").on("change", ":checkbox", function () {
                if ($(this).attr('data-itemtype') == 'identify') {
                    return false;
                }
                var sourceServiceId, sourceLayerId;
                if ($(this).attr('data-serviceid')) {
                    sourceServiceId = $(this).attr('data-serviceid');
                }
                if ($(this).attr('data-sublayerid')) {
                    sourceLayerId = $(this).attr('data-sublayerid');
                }
                if (sourceServiceId == 7 && sourceLayerId == 0) {
                    var ttt = 6;
                }
                if ($(this).attr('data-itemtype') == 'group') {
                    //must cascade
                    var isChecked = $(this).is(':checked');
                    var groupId = $(this).attr('data-groupid');
                    var match = $("#divLayerVisibility :checkbox[data-groupid='" + groupId + "']").length;
                    if (isChecked) {
                        $("#divLayerVisibility :checkbox[data-groupid='" + groupId + "']").prop('checked', true);
                    }
                    else {
                        $("#divLayerVisibility :checkbox[data-groupid='" + groupId + "']").removeAttr('checked');
                    }
                }
                if ($(this).attr('data-itemtype') == 'layer') {
                    var isChecked = $(this).is(':checked');
                    //find the id checkbox corresponding to this layer
                    if (isChecked) {

                        //now we dont necessarily want to check the ID checkbox when we turn a layer visible
                        //$("#divLayerVisibility :checkbox[data-itemtype='identify'][data-serviceid='" + sourceServiceId + "'][data-sublayerid='" + sourceLayerId + "']").prop('checked', true);

                        //make sure group layer is checked for consistencys sake
                        var groupId = $(this).attr('data-groupid');
                        $("#divLayerVisibility :checkbox[data-itemtype='group'][data-groupid='" + groupId + "']").prop('checked', true);
                    }
                    else {
                        $("#divLayerVisibility :checkbox[data-itemtype='identify'][data-serviceid='" + sourceServiceId + "'][data-sublayerid='" + sourceLayerId + "']").removeAttr('checked');
                    }
                }

                var processedGroupLayers = [];
                var cnt = $("#divLayerVisibility :checkbox[data-itemtype='layer']").length;
                //loop through all checkboxes with data-itemtype='layer'
                $("#divLayerVisibility :checkbox[data-itemtype='layer']").each(function () {
                    var isChecked = $(this).is(':checked');
                    var layerId = $(this).attr('data-serviceid');
                    var currentLayer = null;
                    for (var layerCount = 0; layerCount < app.MapLayers.Services.length; layerCount++) {
                        if (app.MapLayers.Services[layerCount].Id == layerId) {
                            currentLayer = app.MapLayers.Services[layerCount];
                            break;
                        }
                    }


                    if ($(this).attr('data-sublayerid')) {
                        //if the checkbox has a sublayer attribute, it's part of a group layer
                        //no use looking through these multiple times, so check which layer the sublayer is a part of
                        //loop through all checkboxes part of the group layer
                        if (processedGroupLayers.indexOf(layerId) == -1) {
                            var visibleSublayers = [];
                            $("#divLayerVisibility :checkbox[data-serviceid='" + layerId + "'][data-itemtype='layer']").each(function () {
                                var sublayerId = $(this).attr('data-sublayerid');
                                if ($(this).is(':checked')) {
                                    visibleSublayers.push(sublayerId);
                                }
                            });
                            if (currentLayer.Id == 7) {
                                var uuy = 7;
                            }
                            if (visibleSublayers.length == 0) {
                                currentLayer.Layer.hide();
                                //if (currentLayer.Layer.layerInfos.length == 1) {
                                //    currentLayer.Layer.hide();
                                //}
                                //else {
                                //    currentLayer.Layer.hide();
                                //    //currentLayer.Layer.setVisibleLayers([-1]);
                                //}

                            }
                            else {
                                //if (currentLayer.Layer.layerInfos.length == 1) {
                                //    currentLayer.Layer.show();
                                //}
                                currentLayer.Layer.show();
                                currentLayer.Layer.setVisibleLayers(visibleSublayers);
                                if (currentLayer.Url == 'http://maps.sussexcountyde.gov/gis/rest/services/Assessment/TaxIndexMap/MapServer') {
                                    var bear = 55;
                                    currentLayer.Layer.refresh();
                                }
                            }

                            processedGroupLayers.push(layerId);
                        }

                    }
                    else {
                        if (isChecked) {
                            currentLayer.Layer.show();
                        }
                        else {
                            currentLayer.Layer.hide();
                        }
                    }
                });


            });
            //$("#chkParcelLayerVisible").prop('checked', app.ParcelLayer.visible);
            //app.LandUseLayer.setVisibleLayers(GetVisibleLayers());
        }


    });




function zoomToSelected(id) {
    require([
        "esri/geometry/geometryEngine",
    "esri/geometry/geometryEngineAsync"],
    function (esriGeometryEngine, esriGeometryEngineAsync) {
        var results = app.LayerResultsStore.query(function (x) {
            return x.id == id;
        })
        var result = results[0];
        var zoomGeom = [];
        if (result.geometry.type == 'point') {
            var pointBuffer = esriGeometryEngine.buffer(result.geometry, 100);
            app.Map.setExtent(pointBuffer.getExtent());
        }
        else {
            app.Map.setExtent(result.geometry.getExtent().expand(1.5));
        }

    });

}
function removeSelectedApplication(id) {
    require([
"dijit/registry",
    "dojo/dom-construct", ],
function (registry, dojoDomConstruct) {
    var idName = "cp_" + id.toString();
    var acc = registry.byId("divApplicationDetails");
    if (acc.hasChildren()) {
        var kids = acc.getChildren();
        for (var childCount = 0; childCount < kids.length; childCount++) {
            if (kids[childCount].id == idName) {
                acc.removeChild(kids[childCount]);
                dojoDomConstruct.destroy(kids[childCount]);
                app.AllResultsStore.remove(id);

                for (var count = 0; count < app.SelectedPointGraphicsLayer.graphics.length; count++) {
                    if (app.SelectedPointGraphicsLayer.graphics[count].attributes["id"] == id) {
                        app.SelectedPointGraphicsLayer.remove(app.SelectedPointGraphicsLayer.graphics[count]);
                    }
                }
                for (var count = 0; count < app.SelectedPolygonGraphicsLayer.graphics.length; count++) {
                    if (app.SelectedPolygonGraphicsLayer.graphics[count].attributes["id"] == id) {
                        app.SelectedPolygonGraphicsLayer.remove(app.SelectedPolygonGraphicsLayer.graphics[count]);
                    }
                }
                for (var count = 0; count < app.ActivePolygonGraphicsLayer.graphics.length; count++) {
                    if (app.ActivePolygonGraphicsLayer.graphics[count].attributes["id"] == id) {
                        app.ActivePolygonGraphicsLayer.remove(app.ActivePolygonGraphicsLayer.graphics[count]);
                    }
                }
                for (var count = 0; count < app.ActivePointGraphicsLayer.graphics.length; count++) {
                    if (app.ActivePointGraphicsLayer.graphics[count].attributes["id"] == id) {
                        app.ActivePointGraphicsLayer.remove(app.ActivePointGraphicsLayer.graphics[count]);
                    }
                }
                $("#spanSelectedApplications").html("Selected Applications (" + app.AllResultsStore.data.length + ")");
                $("#spanZoomAll").show();
                break;
            }

        }
    }
});

    var tt = 5;
}


