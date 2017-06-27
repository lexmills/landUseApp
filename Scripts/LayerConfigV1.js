function ConfigureLayers() {

    app.AddressLocatorSearchConfiguration =
        {
            Url: 'https://maps.sussexcountyde.gov/gis/rest/services/PlanningAndZoning/PlanningZoningLandUseApplications/MapServer/0',
            SearchFieldName: 'Applicant_Name'
        };


    app.AddressLayerSearchConfiguration =
        {
            Url: 'https://maps.sussexcountyde.gov/gis/rest/services/PlanningAndZoning/PlanningZoningLandUseApplications/MapServer/0',
            SearchFieldName: 'Number'
        };


    app.AppYearLayerSearchConfiguration =
    {
        Url: 'https://maps.sussexcountyde.gov/gis/rest/services/PlanningAndZoning/PlanningZoningLandUseApplications/MapServer/0',
        SearchFieldName: 'Application_Year'
    };
    app.AppTypeLayerSearchConfiguration =
    {
        Url: 'https://maps.sussexcountyde.gov/gis/rest/services/PlanningAndZoning/PlanningZoningLandUseApplications/MapServer/0',
        SearchFieldName: 'Application_Type'
    };



    app.ParcelSearchConfiguration = { Options: [] };
    app.ParcelSearchConfiguration.RelatedTableInfo = null;
    app.ParcelSearchConfiguration.ParcelLayerUrl = 'https://maps.sussexcountyde.gov/gis/rest/services/County_Layers/ParcelsWithOwnership/MapServer/0';
    app.ParcelSearchConfiguration.RelatedTableUrl = 'https://maps.sussexcountyde.gov/gis/rest/services/County_Layers/ParcelsWithOwnership/MapServer/3';
    //app.ParcelSearchConfiguration.ParcelLayerUrl = 'http://maps.sussexcountyde.gov/gis/rest/services/Staging/OctoberParcels/MapServer/0';
    //    app.ParcelSearchConfiguration.RelatedTableUrl = 'http://maps.sussexcountyde.gov/gis/rest/services/Staging/OctoberParcels/MapServer/3';
    app.ParcelSearchConfiguration.LayerFields = ['NAME'];
    app.ParcelSearchConfiguration.TableFields =
        [
            'PINWASSEMENTUNIT',
            'DEED_BOOK_PG',
            'FULLNAME',
            'SECONDOWNER_NAME',
            'MAILINGADDRESS',
            'CITY',
            'STATE',
            'ZIPCODE',
            'DESCRIPTION',
            'DESCRIPTION2',
            'DESCRIPTION3',
            'TOWNCODE',
            'COUNCILMAN',
            'FIRE',
            'SCHOOL',
            'FLOOD',
            'LANDUSE',
            'Acre',
            'Depth',
            'FRONTFOOT',
            'CAP',
            'IMPROVEMENT',
            'LANDIMPR',
            'IRREGULAR',
            'SCALED',
            'FARM',
            'FLAG',
            'EXEMPT'
        ];
    app.ParcelSearchConfiguration.RelationshipId = 0;
    app.ParcelSearchConfiguration.Options =
        [
            {
                Label: 'Tax ID',
                SearchType: 'layer',
                FieldName: 'Name',
                Id: 'taxid'
            },
            {
                Label: 'Parcel Owner Name',
                SearchType: 'table',
                FieldName: 'FULLNAME',
                Id: 'owner'
            },
        ];


    //group order - higher number = lower in map
    //groups are for legend organization
    app.LayerGroups = [
        {
            Name: '2017 Applications',
            Order: 1
        },
		{
		    Name: '2016 Applications',
		    Order: 2
		},
        {
            Name: '2015 Applications',
            Order: 3
        },

		    {
		        Name: '2014 Applications',
		        Order: 4
		    },
        {
            Name: '2013 Applications',
            Order: 5
        },
	       {
	           Name: '2012 Applications',
	           Order: 6
	       },
		      {
		          Name: '2011 Applications',
		          Order: 7
		      },
        {
            Name: 'Zoning',
            Order: 8
        },
        {
            Name: 'Parcels',
            Order: 9
        }
    ]
    app.MapLayers = new LayerCollection();

    app.MapLayers.AddService(
    {
        Url: 'https://maps.sussexcountyde.gov/gis/rest/services/PlanningAndZoning/PlanningZoningLandUseApplications/MapServer',
        Layers:
            [
                {
                    Name: 'Change of Zone',
                    LayerId: 2,
                    GroupName: '2017 Applications',
                    GroupOrder: 1,
                    Queryable: true,
                    Fields:
                        [
                            'Parcel ID',
                            'Application Number',
                            'Applicant Name',
                            'Application Type',
                            'Hyperlink',
                            'Application Year'
                        ],
                    Visible: true
                },
                {
                    Name: 'Conditional Use',
                    LayerId: 3,
                    GroupName: '2017 Applications',
                    GroupOrder: 2,
                    Queryable: true,
                    Fields:
                        [
                            'Parcel ID',
                            'Application Number',
                            'Applicant Name',
                            'Application Type',
                            'Hyperlink',
                            'Application Year'
                        ],
                    Visible: true
                },
                {
                    Name: 'Special Use Exception',
                    LayerId: 4,
                    GroupName: '2017 Applications',
                    GroupOrder: 3,
                    Queryable: true,
                    Fields:
                        [
                            'Parcel ID',
                            'Application Number',
                            'Applicant Name',
                            'Application Type',
                            'Hyperlink',
                            'Application Year'
                        ],
                    Visible: true
                },
                {
                    Name: 'Subdivision',
                    LayerId: 5,
                    GroupName: '2017 Applications',
                    GroupOrder: 4,
                    Queryable: true,
                    Fields:
                        [
                            'Parcel ID',
                            'Application Number',
                            'Applicant Name',
                            'Application Type',
                            'Hyperlink',
                            'Application Year'
                        ],
                    Visible: true
                },
                {
                    Name: 'Variance',
                    LayerId: 6,
                    GroupName: '2017 Applications',
                    GroupOrder: 5,
                    Queryable: true,
                    Fields:
                        [
                            'Parcel ID',
                            'Application Number',
                            'Applicant Name',
                            'Application Type',
                            'Hyperlink',
                            'Application Year'
                        ],
                    Visible: true
                },
                                {
                                    Name: 'Change of Zone',
                                    LayerId: 8,
                                    GroupName: '2016 Applications',
                                    GroupOrder: 1,
                                    Queryable: true,
                                    Fields:
                                        [
                            'Parcel ID',
                            'Application Number',
                            'Applicant Name',
                            'Application Type',
                            'Hyperlink',
                            'Application Year'
                                        ],
                                    Visible: true
                                },
                {
                    Name: 'Conditional Use',
                    LayerId: 9,
                    GroupName: '2016 Applications',
                    GroupOrder: 2,
                    Queryable: true,
                    Fields:
                        [
                            'Parcel ID',
                            'Application Number',
                            'Applicant Name',
                            'Application Type',
                            'Hyperlink',
                            'Application Year'
                        ],
                    Visible: true
                },
                {
                    Name: 'Special Use Exception',
                    LayerId: 10,
                    GroupName: '2016 Applications',
                    GroupOrder: 3,
                    Queryable: true,
                    Fields:
                        [
                            'Parcel ID',
                            'Application Number',
                            'Applicant Name',
                            'Application Type',
                            'Hyperlink',
                            'Application Year'
                        ],
                    Visible: true
                },
                {
                    Name: 'Subdivision',
                    LayerId: 11,
                    GroupName: '2016 Applications',
                    GroupOrder: 4,
                    Queryable: true,
                    Fields:
                        [
                            'Parcel ID',
                            'Application Number',
                            'Applicant Name',
                            'Application Type',
                            'Hyperlink',
                            'Application Year'
                        ],
                    Visible: true
                },
                {
                    Name: 'Variance',
                    LayerId: 12,
                    GroupName: '2016 Applications',
                    GroupOrder: 5,
                    Queryable: true,
                    Fields:
                        [
                            'Parcel ID',
                            'Application Number',
                            'Applicant Name',
                            'Application Type',
                            'Hyperlink',
                            'Application Year'
                        ],
                    Visible: true
                },
                                {
                                    Name: 'Change of Zone',
                                    LayerId: 14,
                                    GroupName: '2015 Applications',
                                    GroupOrder: 1,
                                    Queryable: true,
                                    Fields:
                                        [
                            'Parcel ID',
                            'Application Number',
                            'Applicant Name',
                            'Application Type',
                            'Hyperlink',
                            'Application Year'
                                        ],
                                    Visible: false
                                },
                {
                    Name: 'Conditional Use',
                    LayerId: 15,
                    GroupName: '2015 Applications',
                    GroupOrder: 2,
                    Queryable: true,
                    Fields:
                        [
                            'Parcel ID',
                            'Application Number',
                            'Applicant Name',
                            'Application Type',
                            'Hyperlink',
                            'Application Year'
                        ],
                    Visible: false
                },
                {
                    Name: 'Special Use Exception',
                    LayerId: 16,
                    GroupName: '2015 Applications',
                    GroupOrder: 3,
                    Queryable: true,
                    Fields:
                        [
                            'Parcel ID',
                            'Application Number',
                            'Applicant Name',
                            'Application Type',
                            'Hyperlink',
                            'Application Year'
                        ],
                    Visible: false
                },
                {
                    Name: 'Subdivision',
                    LayerId: 17,
                    GroupName: '2015 Applications',
                    GroupOrder: 4,
                    Queryable: true,
                    Fields:
                        [
                            'Parcel ID',
                            'Application Number',
                            'Applicant Name',
                            'Application Type',
                            'Hyperlink',
                            'Application Year'
                        ],
                    Visible: false
                },
                {
                    Name: 'Variance',
                    LayerId: 18,
                    GroupName: '2015 Applications',
                    GroupOrder: 5,
                    Queryable: true,
                    Fields:
                        [
                            'Parcel ID',
                            'Application Number',
                            'Applicant Name',
                            'Application Type',
                            'Hyperlink',
                            'Application Year'
                        ],
                    Visible: false
                },
                                {
                                    Name: 'Change of Zone',
                                    LayerId: 20,
                                    GroupName: '2014 Applications',
                                    GroupOrder: 1,
                                    Queryable: true,
                                    Fields:
                                        [
                            'Parcel ID',
                            'Application Number',
                            'Applicant Name',
                            'Application Type',
                            'Hyperlink',
                            'Application Year'
                                        ],
                                    Visible: false
                                },
                {
                    Name: 'Conditional Use',
                    LayerId: 21,
                    GroupName: '2014 Applications',
                    GroupOrder: 2,
                    Queryable: true,
                    Fields:
                        [
                            'Parcel ID',
                            'Application Number',
                            'Applicant Name',
                            'Application Type',
                            'Hyperlink',
                            'Application Year'
                        ],
                    Visible: false
                },
                {
                    Name: 'Special Use Exception',
                    LayerId: 22,
                    GroupName: '2014 Applications',
                    GroupOrder: 3,
                    Queryable: true,
                    Fields:
                        [
                            'Parcel ID',
                            'Application Number',
                            'Applicant Name',
                            'Application Type',
                            'Hyperlink',
                            'Application Year'
                        ],
                    Visible: false
                },
                {
                    Name: 'Subdivision',
                    LayerId: 23,
                    GroupName: '2014 Applications',
                    GroupOrder: 4,
                    Queryable: true,
                    Fields:
                        [
                            'Parcel ID',
                            'Application Number',
                            'Applicant Name',
                            'Application Type',
                            'Hyperlink',
                            'Application Year'
                        ],
                    Visible: false
                },
                {
                    Name: 'Variance',
                    LayerId: 24,
                    GroupName: '2014 Applications',
                    GroupOrder: 5,
                    Queryable: true,
                    Fields:
                        [
                            'Parcel ID',
                            'Application Number',
                            'Applicant Name',
                            'Application Type',
                            'Hyperlink',
                            'Application Year'
                        ],
                    Visible: false
                },

                                {
                                    Name: 'Change of Zone',
                                    LayerId: 26,
                                    GroupName: '2013 Applications',
                                    GroupOrder: 1,
                                    Queryable: true,
                                    Fields:
                                        [
                            'Parcel ID',
                            'Application Number',
                            'Applicant Name',
                            'Application Type',
                            'Hyperlink',
                            'Application Year'
                                        ],
                                    Visible: false
                                },
                {
                    Name: 'Conditional Use',
                    LayerId: 27,
                    GroupName: '2013 Applications',
                    GroupOrder: 2,
                    Queryable: true,
                    Fields:
                        [
                            'Parcel ID',
                            'Application Number',
                            'Applicant Name',
                            'Application Type',
                            'Hyperlink',
                            'Application Year'
                        ],
                    Visible: false
                },
                {
                    Name: 'Special Use Exception',
                    LayerId: 28,
                    GroupName: '2013 Applications',
                    GroupOrder: 3,
                    Queryable: true,
                    Fields:
                        [
                            'Parcel ID',
                            'Application Number',
                            'Applicant Name',
                            'Application Type',
                            'Hyperlink',
                            'Application Year'
                        ],
                    Visible: false
                },
                {
                    Name: 'Subdivision',
                    LayerId: 29,
                    GroupName: '2013 Applications',
                    GroupOrder: 4,
                    Queryable: true,
                    Fields:
                        [
                            'Parcel ID',
                            'Application Number',
                            'Applicant Name',
                            'Application Type',
                            'Hyperlink',
                            'Application Year'
                        ],
                    Visible: false
                },
                {
                    Name: 'Variance',
                    LayerId: 30,
                    GroupName: '2013 Applications',
                    GroupOrder: 5,
                    Queryable: true,
                    Fields:
                        [
                            'Parcel ID',
                            'Application Number',
                            'Applicant Name',
                            'Application Type',
                            'Hyperlink',
                            'Application Year'
                        ],
                    Visible: false
                },

                                {
                                    Name: 'Change of Zone',
                                    LayerId: 32,
                                    GroupName: '2012 Applications',
                                    GroupOrder: 1,
                                    Queryable: true,
                                    Fields:
                                        [
                            'Parcel ID',
                            'Application Number',
                            'Applicant Name',
                            'Application Type',
                            'Hyperlink',
                            'Application Year'
                                        ],
                                    Visible: false
                                },
                {
                    Name: 'Conditional Use',
                    LayerId: 33,
                    GroupName: '2012 Applications',
                    GroupOrder: 2,
                    Queryable: true,
                    Fields:
                        [
                            'Parcel ID',
                            'Application Number',
                            'Applicant Name',
                            'Application Type',
                            'Hyperlink',
                            'Application Year'
                        ],
                    Visible: false
                },
                {
                    Name: 'Special Use Exception',
                    LayerId: 34,
                    GroupName: '2012 Applications',
                    GroupOrder: 3,
                    Queryable: true,
                    Fields:
                        [
                            'Parcel ID',
                            'Application Number',
                            'Applicant Name',
                            'Application Type',
                            'Hyperlink',
                            'Application Year'
                        ],
                    Visible: false
                },
                {
                    Name: 'Subdivision',
                    LayerId: 35,
                    GroupName: '2012 Applications',
                    GroupOrder: 4,
                    Queryable: true,
                    Fields:
                        [
                            'Parcel ID',
                            'Application Number',
                            'Applicant Name',
                            'Application Type',
                            'Hyperlink',
                            'Application Year'
                        ],
                    Visible: false
                },
                {
                    Name: 'Variance',
                    LayerId: 36,
                    GroupName: '2012 Applications',
                    GroupOrder: 5,
                    Queryable: true,
                    Fields:
                        [
                            'Parcel ID',
                            'Application Number',
                            'Applicant Name',
                            'Application Type',
                            'Hyperlink',
                            'Application Year'
                        ],
                    Visible: false
                },

                                {
                                    Name: 'Change of Zone',
                                    LayerId: 38,
                                    GroupName: '2011 Applications',
                                    GroupOrder: 1,
                                    Queryable: true,
                                    Fields:
                                        [
                            'Parcel ID',
                            'Application Number',
                            'Applicant Name',
                            'Application Type',
                            'Hyperlink',
                            'Application Year'
                                        ],
                                    Visible: false
                                },
                {
                    Name: 'Conditional Use',
                    LayerId: 39,
                    GroupName: '2011 Applications',
                    GroupOrder: 2,
                    Queryable: true,
                    Fields:
                        [
                            'Parcel ID',
                            'Application Number',
                            'Applicant Name',
                            'Application Type',
                            'Hyperlink',
                            'Application Year'
                        ],
                    Visible: false
                },
                {
                    Name: 'Special Use Exception',
                    LayerId: 40,
                    GroupName: '2011 Applications',
                    GroupOrder: 3,
                    Queryable: true,
                    Fields:
                        [
                            'Parcel ID',
                            'Application Number',
                            'Applicant Name',
                            'Application Type',
                            'Hyperlink',
                            'Application Year'
                        ],
                    Visible: false
                },
                {
                    Name: 'Subdivision',
                    LayerId: 41,
                    GroupName: '2011 Applications',
                    GroupOrder: 4,
                    Queryable: true,
                    Fields:
                        [
                            'Parcel ID',
                            'Application Number',
                            'Applicant Name',
                            'Application Type',
                            'Hyperlink',
                            'Application Year'
                        ],
                    Visible: false
                },
                {
                    Name: 'Variance',
                    LayerId: 42,
                    GroupName: '2011 Applications',
                    GroupOrder: 5,
                    Queryable: true,
                    Fields:
                        [
                            'Parcel ID',
                            'Application Number',
                            'Applicant Name',
                            'Application Type',
                            'Hyperlink',
                            'Application Year'
                        ],
                    Visible: false
                },
            ]
    }
    );



    app.MapLayers.AddService(
    {
        Url: 'https://maps.sussexcountyde.gov/gis/rest/services/County_Layers/ParcelsWithOwnership/MapServer',

        Layers:
            [
                {
                    Name: 'Parcels',
                    LayerId: 0,
                    GroupName: 'Parcels',
                    GroupOrder: 2,
                    Queryable: true,
                    IsDefaultExtent: true,
                    Visible: true,
                    Relationships:
                            [
                            {
                                RelationshipName: "OwnershipInformation",
                                Fields:
                                    [
                                        'PINWASSEMENTUNIT',
                                        'DEED_BOOK_PG',
                                        'FULLNAME',
                                        'SECONDOWNER_NAME',
                                        'MAILINGADDRESS',
                                        'CITY',
                                        'STATE',
                                        'ZIPCODE',
                                        'DESCRIPTION',
                                        'DESCRIPTION2',
                                        'DESCRIPTION3',
                                        'TOWNCODE',
                                        'COUNCILMAN',
                                        'FIRE',
                                        'SCHOOL',
                                        'FLOOD',
                                        'LANDUSE',
                                        'Acre',
                                        'Depth',
                                        'FRONTFOOT',
                                        'CAP',
                                        'IMPROVEMENT',
                                        'LANDIMPR',
                                        'IRREGULAR',
                                        'SCALED',
                                        'FARM',
                                        'FLAG',
                                        'EXEMPT'
                                    ]
                            }
                            ]
                },
                {
                    Name: 'Parcel Labels',
                    LayerId: 1,
                    GroupName: 'Parcels',
                    GroupOrder: 1,
                    Queryable: false,
                    Visible: true
                },
                {
                    Name: 'Annotation',
                    LayerId: 2,
                    GroupName: 'Parcels',
                    GroupOrder: 3,
                    Queryable: false,
                    Visible: true
                }
            ]
    }
    );


    // zoning
    app.MapLayers.AddService(
    {
        Url: 'https://maps.sussexcountyde.gov/gis/rest/services/PlanningAndZoning/Zoning/MapServer',
        Layers:
            [
                {
                    Name: 'Dimensions',
                    LayerId: 0,
                    GroupName: 'Zoning',
                    GroupOrder: 2,
                    Queryable: true,
                    Visible: false
                },
               {
                   Name: 'Zoning',
                   LayerId: 1,
                   GroupName: 'Zoning',
                   GroupOrder: 1,
                   Queryable: true,
                   Visible: false
               },
            ]
    }
    );





}



/* function ConfigureLayers() {

    app.AddressLocatorSearchConfiguration =
        {
            LocatorUrl: 'https://firstmap.gis.delaware.gov/arcgis/rest/services/Location/DE_CompositeLocator/GeocodeServer',
            SingleLineFieldName: 'SingleLine'
        };


    app.AddressLayerSearchConfiguration =
        {
            Url: 'https://maps.sussexcountyde.gov/gis/rest/services/County_Layers/911Addresses/MapServer/0',
            SearchFieldName: 'PrimaryAddress'
        };

    app.ParcelSearchConfiguration = { Options: [] };
    app.ParcelSearchConfiguration.RelatedTableInfo = null;
	app.ParcelSearchConfiguration.ParcelLayerUrl = 'https://maps.sussexcountyde.gov/gis/rest/services/County_Layers/ParcelsWithOwnership/MapServer/0';
	app.ParcelSearchConfiguration.RelatedTableUrl = 'https://maps.sussexcountyde.gov/gis/rest/services/County_Layers/ParcelsWithOwnership/MapServer/3';
	//app.ParcelSearchConfiguration.ParcelLayerUrl = 'http://maps.sussexcountyde.gov/gis/rest/services/Staging/OctoberParcels/MapServer/0';
	//    app.ParcelSearchConfiguration.RelatedTableUrl = 'http://maps.sussexcountyde.gov/gis/rest/services/Staging/OctoberParcels/MapServer/3';
	app.ParcelSearchConfiguration.LayerFields = ['NAME'];
    app.ParcelSearchConfiguration.TableFields =
        [
            'PINWASSEMENTUNIT',
            'DEED_BOOK_PG',
            'FULLNAME',
            'SECONDOWNER_NAME',
            'MAILINGADDRESS',
            'CITY',
            'STATE',
            'ZIPCODE',
            'DESCRIPTION',
            'DESCRIPTION2',
            'DESCRIPTION3',
            'TOWNCODE',
            'COUNCILMAN',
            'FIRE',
            'SCHOOL',
            'FLOOD',
            'LANDUSE',
            'Acre',
            'Depth',
            'FRONTFOOT',
            'CAP',
            'IMPROVEMENT',
            'LANDIMPR',
            'IRREGULAR',
            'SCALED',
            'FARM',
            'FLAG',
            'EXEMPT'
        ];
    app.ParcelSearchConfiguration.RelationshipId = 0;
    app.ParcelSearchConfiguration.Options =
        [
            {
                Label: 'Tax ID',
                SearchType: 'layer',
                FieldName: 'Name',
                Id: 'taxid'
            },
            {
                Label: 'Owner Name',
                SearchType: 'table',
                FieldName: 'FULLNAME',
                Id: 'owner'
            },
        ];


    //group order - higher number = lower in map
    //groups are for legend organization
    app.LayerGroups = [
        {
            Name: 'Addresses/Parcels',
            Order: 1
        },
        {
            Name: 'County Districts',
            Order: 2
        },
		{
            Name: 'Schools/Libraries',
            Order: 3
        },
        {
            Name: 'Hydrology',
            Order: 4
        },
		{
            Name: 'Tax Index',
            Order: 5
        },
		{
            Name: 'Transportation',
            Order: 6
        },
        {
            Name: 'Statewide',
            Order: 7
        }
    ]
    app.MapLayers = new LayerCollection();

    app.MapLayers.AddService(
    {
        Url: 'https://firstmap.gis.delaware.gov/arcgis/rest/services/Society/DE_Schools/MapServer',
        Layers:
            [
                {
                    Name: 'Public Schools',
                    LayerId: 0,
                    GroupName: 'Schools/Libraries',
                    GroupOrder: 1,
                    Queryable: true,
                    Fields:
                        [
                            'NAME',
                            'ADDRESS',
                            'GRADESPAN',
                            'DISTRICT',
                            'SCHOOL_URL'
                        ],
                    Visible: true
                },
            ]
    }
    );

    //libraries
    app.MapLayers.AddService(
    {
        Url: 'https://firstmap.gis.delaware.gov/arcgis/rest/services/Society/DE_Libraries/MapServer',
        Layers:
            [
                {
                    Name: 'Libraries',
                    LayerId: 0,
                    GroupName: 'Schools/Libraries',
                    GroupOrder: 3,
                    Queryable: true,
                    Visible: true,
                    Fields:
                        [
                            'NAME',
                            'STREETADD',
                            'CITY',
                            'STATE',
                            'ZIPCODE',
                            'URL'
                        ]
                }
            ]
    }
    );

    //school districts
    app.MapLayers.AddService(
    {
        Url: 'https://firstmap.delaware.gov/arcgis/rest/services/Boundaries/DE_SchoolDistricts/MapServer',
        Layers:
            [
                {
                    Name: 'School Districts',
                    LayerId: 0,
                    GroupName: 'Schools/Libraries',
                    GroupOrder: 4,
                    Queryable: true,
//
                    Visible: false
                },
                {
                    Name: 'VoTech School Districts',
                    LayerId: 1,
                    GroupName: 'Schools/Libraries',
                    GroupOrder: 5,
                    Queryable: true,
//
                    Visible: false


                }
            ]
    }
    );
//addressesParcels
    app.MapLayers.AddService(
    {
        Url: 'https://maps.sussexcountyde.gov/gis/rest/services/County_Layers/911Addresses/MapServer',
        Layers:
            [
                {
                    Name: '911 Addresses',
                    LayerId: 0,
                    GroupName: 'Addresses/Parcels',
                    GroupOrder: 1,
                    Queryable: false,
                    Visible: true
                }
            ]
    }
    );
    app.MapLayers.AddService(
    {
        Url: 'https://maps.sussexcountyde.gov/gis/rest/services/County_Layers/ParcelsWithOwnership/MapServer',
		//Url: 'http://maps.sussexcountyde.gov/gis/rest/services/Staging/OctoberParcels/MapServer',
        Layers:
            [
                {
                    Name: 'Parcels',
                    LayerId: 0,
                    GroupName: 'Addresses/Parcels',
                    GroupOrder: 2,
                    Queryable: true,
                    IsDefaultExtent: true,
                    Visible: true,
                    Relationships:
                            [
                            {
                                RelationshipName: "OwnershipInformation",
                                Fields:
                                    [
                                        'PINWASSEMENTUNIT',
                                        'DEED_BOOK_PG',
                                        'FULLNAME',
                                        'SECONDOWNER_NAME',
                                        'MAILINGADDRESS',
                                        'CITY',
                                        'STATE',
                                        'ZIPCODE',
                                        'DESCRIPTION',
                                        'DESCRIPTION2',
                                        'DESCRIPTION3',
                                        'TOWNCODE',
                                        'COUNCILMAN',
                                        'FIRE',
                                        'SCHOOL',
                                        'FLOOD',
                                        'LANDUSE',
                                        'Acre',
                                        'Depth',
                                        'FRONTFOOT',
                                        'CAP',
                                        'IMPROVEMENT',
                                        'LANDIMPR',
                                        'IRREGULAR',
                                        'SCALED',
                                        'FARM',
                                        'FLAG',
                                        'EXEMPT'
                                    ]
                            }
                            ]
                },
                {
                    Name: 'Parcel Labels',
                    LayerId: 1,
                    GroupName: 'Addresses/Parcels',
                    GroupOrder: 1,
                    Queryable: false,
                    Visible: true
                },
                {
                    Name: 'Annotation',
                    LayerId: 2,
                    GroupName: 'Addresses/Parcels',
                    GroupOrder: 3,
                    Queryable: false,
                    Visible: true
                }
            ]
    }
    );
// ///////////////////////////////////////////////////////////////////////////////////	
 	    app.MapLayers.AddService(
 //   {
 //       Url: 'https://firstmap.delaware.gov/arcgis/rest/services/BaseMap/DE_Basemap/MapServer',
 //       Layers:
 //           [
 //               {
//					Name: 'Major Routes',
 //                   LayerId: 2,
 //                   GroupName: 'Transportation',
 //                   GroupOrder: 1,
//                    Queryable: false,
 //                   Visible: true
 //               }
 //           ]
  //  }
 //   ); 
// ///////////////////////////////////////////////////////////////////////////////////	
	    app.MapLayers.AddService(
    {
        Url: 'https://maps.sussexcountyde.gov/gis/rest/services/County_Layers/Roads/MapServer',
        Layers:
            [
                {
                    Name: 'Streets',
                    LayerId: 0,
                    GroupName: 'Transportation',
                    GroupOrder: 2,
                    Queryable: false,					
                    Visible: true
                }
            ]
    }
    );
//districts
   app.MapLayers.AddService(
    {
        Url: 'https://maps.sussexcountyde.gov/gis/rest/services/Districts/MapServer',
        Layers:
            [
                {
                    Name: 'Zip Codes',
                    LayerId: 0,
                    GroupName: 'County Districts',
                    GroupOrder: 1,
                    Queryable: true,
                    Visible: true
                },
                {
                    Name: 'Fire Districts',
                    LayerId: 1,
                    GroupName: 'County Districts',
                    GroupOrder: 2,
                    Queryable: false,
                    Visible: false
                },
                {
                    Name: 'County Council Districts',
                    LayerId: 2,
                    GroupName: 'County Districts',
                    GroupOrder: 4,
                    Queryable: false,
                    Visible: false
                },
                {
                    Name: 'County Boundary',
                    LayerId: 3,
                    GroupName: 'County Districts',
                    GroupOrder: 5,
                    Queryable: false,
//					
                    Visible: true
                }
            ]
    }
    );
	
    app.MapLayers.AddService(
    {
        Url: 'https://maps.sussexcountyde.gov/gis/rest/services/County_Layers/SanitarySewerDistricts/MapServer',
        Layers:
            [
                {
                    Name: 'Sanitary Sewer Districts',
                    LayerId: 0,
                    GroupName: 'County Districts',
                    GroupOrder: 3,
                    Queryable: true,
                    Visible: false
                }
            ]
    }
    );
//taxindex
	app.MapLayers.AddService(
    {
        Url: 'https://maps.sussexcountyde.gov/gis/rest/services/Assessment/TaxIndex/MapServer',
        Layers:
            [
                {
                    Name: 'Hundred Boundaries',
                    LayerId: 0,
                    GroupName: 'Tax Index',
                    GroupOrder: 1,
                    Queryable: false,
                    Visible: false
                },
				{
                    Name: 'District Boundaries',
                    LayerId: 1,
                    GroupName: 'Tax Index',
                    GroupOrder: 2,
                    Queryable: false,
                    Visible: false
                },
				{
                    Name: 'Map Grid',
                    LayerId: 2,
                    GroupName: 'Tax Index',
                    GroupOrder: 3,
                    Queryable: false,
                    Visible: false
                },
				{
                    Name: 'Map Index',
                    LayerId: 3,
                    GroupName: 'Tax Index',
                    GroupOrder: 4,
                    Queryable: false,
                    Visible: false
                }
            ]
    }
    );
//hydrology
    app.MapLayers.AddService(
    {
        Url: 'https://maps.sussexcountyde.gov/gis/rest/services/PlanningAndZoning/FloodZones2015/MapServer',
        Layers:
            [
                {
                    Name: 'Flood Zones',
                    LayerId: 0,
                    GroupName: 'Hydrology',
                    GroupOrder: 4,
                    Queryable: false,
                    Visible: false
                }
            ]
    }
    );

    app.MapLayers.AddService(
    {
        Url: 'https://maps.sussexcountyde.gov/gis/rest/services/County_Layers/Watersheds/MapServer',
        Layers:
            [
                {
                    Name: 'Watersheds',
                    LayerId: 0,
                    GroupName: 'Hydrology',
                    GroupOrder: 5,
                    Queryable: false,
                    Visible: false
                }
            ]
    }
    );

    app.MapLayers.AddService(
    {
        Url: 'https://firstmap.delaware.gov/arcgis/rest/services/BaseMap/DE_Basemap/MapServer',
        Layers:
            [
                {
                    Name: 'Streams',
                    LayerId: 7,
                    GroupName: 'Hydrology',
                    GroupOrder: 1,
                    Queryable: false,
                    Visible: true
                },
                {
                    Name: 'Major Rivers',
                    LayerId: 6,
                    GroupName: 'Hydrology',
                    GroupOrder: 2,
                    Queryable: false,
                    Visible: true
                },
                {
                    Name: 'Lakes, Ponds, Bays',
                    LayerId: 8,
                    GroupName: 'Hydrology',
                    GroupOrder: 3,
                    Queryable: false,
                    Visible: false
                },
                {
                    Name: 'Major Routes',
                    LayerId: 2,
                    GroupName: 'Transportation',
                    GroupOrder: 1,
                    Queryable: false,
                    Visible: true
                }, 
                {
                    Name: 'Railroads',
                    LayerId: 4,
                    GroupName: 'Transportation',
                    GroupOrder: 3,
                    Queryable: false,
//					
                    Visible: false
                },
                {
                    Name: 'Geographic Names',
                    LayerId: 12,
                    GroupName: 'Statewide',
                    GroupOrder: 1,
                    Queryable: false,
                    Visible: false
                },
                {
                    Name: 'Publically Protected Land',
                    LayerId: 11,
                    GroupName: 'Statewide',
                    GroupOrder: 2,
                    Queryable: false,
                    Visible: false
                },
                {
                    Name: 'Contours',
                    LayerId: 9,
                    GroupName: 'Statewide',
                    GroupOrder: 3,
                    Queryable: false,
                    Visible: false
                },
                {
                    Name: 'Municipalities',
                    LayerId: 10,
                    GroupName: 'Statewide',
                    GroupOrder: 4,
                    Queryable: false,
                    Visible: true
                },
                {
                    Name: 'Communities',
                    LayerId: 13,
                    GroupName: 'Statewide',
                    GroupOrder: 5,
                    Queryable: false,
                    Visible: true
                }
            ]
    }
    );
























    



} */