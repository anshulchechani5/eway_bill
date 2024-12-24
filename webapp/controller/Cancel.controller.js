sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/UIComponent",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageBox"
    ],
    function (BaseController, UIComponent, JSONModel, MessageBox) {
        "use strict";

        return BaseController.extend("yewaybill.yewaybill.controller.Cancel", {
            onInit() {

                // this.getView().setModel(oModel, "view1");

                UIComponent.getRouterFor(this).getRoute('Cancel').attachPatternMatched(this._onRouteMatch, this);
            },
            _onRouteMatch: function (oEvent) {
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                this.getView().setModel(new JSONModel(), "oTableItemModel");
                this.getView().getModel('oTableItemModel').setProperty("/aTableItem", []);
                var oSettingObject = {
                    "editable": true,
                    "buttonVisible": true,
                    "buttonIrn": "Generate IRN",
                    "buttonEway": "Generate EwayBill & IRN",
                    "setEditable": true
                };
                this.getView().setModel(new JSONModel(oSettingObject), "oGenericModel");

                // if (oCommonModel.getProperty('/displayObject').Action === "Create") {
                //     this.onReadNumberRange();
                //     var oDate = new Date();
                //     var oPayloadObject = {
                //         "Gateno": "",
                //         "GateInDate": oDate.getDate() + '-' + Number(oDate.getMonth() + 1) + '-' + oDate.getFullYear(),
                //         "VehicalNo": "",
                //         "Operator": "",
                //         "GateInDt": "",
                //         "GateInTm": "",
                //         "LrDate": "",
                //         "LrNo": "",
                //         "Remark": "",
                //         "RefGate": "",
                //         "Plant": oCommonModel.getProperty('/plantObject').Plant,
                //         //"Approved": "",
                //         "Puchgrp": "",
                //         "Driver": "",
                //         "DrLisc": "",
                //         "GateOutDt": "",
                //         "GateOutTm": "",
                //         "Driverno": "",
                //         "to_gateitem": {
                //             results: []
                //         }
                //     };
                //     this.getView().setModel(new JSONModel(oPayloadObject), "oGateEntryHeadModel");
                //     this.getView().getModel("oGenericModel").setProperty("/editable", true);
                //     this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", true);
                //     this.getView().getModel("oGenericModel").setProperty("/SaveBtnVisible", true);
                // }

                if (oCommonModel.getProperty('/displayObject').Action === "Generate") {
                    this.onReadData();

                } else if (oCommonModel.getProperty('/displayObject').Action === "Display") {
                    this.onReadData();

                    // this.getView().getModel("oGenericModel").setProperty("/buttonVisible", false);
                    // this.getView().getModel("oGenericModel").setProperty("/setEditable", false);


                } else if (oCommonModel.getProperty('/displayObject').Action === 'Cancel') {
                    this.onReadData();
                    this.getView().getModel("oGenericModel").setProperty("/buttonIrn", "Cancel IRN");
                    this.getView().getModel("oGenericModel").setProperty("/buttonEway", "Cancel EwayBill & IRN");
                    this.getView().getModel("oGenericModel").setProperty("/setEditable", false);
                    this.getView().setModel("oGenericModel").setProperty("/buttonVisible", true);
                }
                else if (oCommonModel.getProperty('/displayObject').Action === "Create" && (gateType === '1' || gateType === '2')) {
                    if (gateType === '2') {
                        this.getView().getModel("oGenericModel").setProperty("/labelForType", "Invoice");
                    } else {
                        this.getView().getModel("oGenericModel").setProperty("/labelForType", "Delivery No");
                    }


                } else if (oCommonModel.getProperty('/displayObject').Action === "Change") {
                    this.getView().getModel("oGenericModel").setProperty("/editable", true);
                    this.getView().getModel("oGenericModel").setProperty("/gateEntryNumEdit", true);
                    this.getView().getModel("oGenericModel").setProperty("/deliveryNumVisible", false);
                    this.getView().getModel("oGenericModel").setProperty("/SaveBtnVisible", true);
                    this.onreadGateData();
                } else if (oCommonModel.getProperty("/displayObject").Action === "Create" && (gateType === '3' || gateType === '5')) {
                    this.getView().getModel("oGenericModel").setProperty("/labelForType", "PO Number");
                }
                else if (oCommonModel.getProperty("/displayObject").Action === "Create" && gateType === '3' && gateinout === "Out") {
                    this.getView().getModel("oGenericModel").setProperty("/RefGateEditable", false);
                }

            },

            onReadData: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Loading",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var oCommonModel = this.getOwnerComponent().getModel('oCommonModel');
                var oTableModel = this.getView().getModel('oTableItemModel');
                var oModel = this.getView().getModel();
                var billdoc = oCommonModel.getProperty('/displayObject').BillDoc;
                var oFilter = new sap.ui.model.Filter("BillingDocument", "EQ", billdoc);

                oModel.read("/YEINVOICE_CDS", {
                    filters: [oFilter],
                    success: function (oresponse) {
                        oBusyDialog.close();
                        var oNewResponseArr = [];

                        // this.getView().setModel(new JSONModel(oresponse.results[0]), "oGateEntryHeadModel");
                        console.log(oresponse);
                        if (oresponse.results.length > 0) {
                            oTableModel.setProperty("/aTableItem", oresponse.results);
                            this.getView().byId('table1').setVisibleRowCount(oresponse.results);

                        }
                    }.bind(this)
                })

            },

            // generateEwayBillIrn: function () {
            //     var oTableModel = this.getView().getModel('oTableItemModel');
            //     var tableModel = oTableModel.getProperty('/aTableItem');

            //     var billingdoc = tableModel[0].BillingDocument;
            //     var eway = tableModel[0].Ebillno;
            //     var transportname = tableModel[0].TRANSPORTERNAME;
            //     var transdoc = tableModel[0].TransDocNo;
            //     var vehiclenum = tableModel[0].VEHICLENUMBER;
            //     var transid = tableModel[0].TRANSID;
            //     var distance = tableModel[0].CONDTY;

            //     // var url = "https://my402116-api.s4hana.cloud.sap/sap/bc/http/sap/yeinv_http?Irn=X&eway=X&invoice=90000001&transporter=3556667&DISTANCE=6&transportdoc=&transportid=&vehiclenumber=";

            //     var url1 = "/sap/bc/http/sap/yeinv_http?Irn=X&eway=X";
            //     var url2 = "&invoice=";
            //     var url3 = "&transporter=";
            //     var url4 = "&transportdoc=";
            //     var url5 = "&transportid=";
            //     var url6 = "&vehiclenumber";
            //     var url7 = "&DISTANCE=";

            //     var url6 = url2 + billingdoc;
            //     var url7 = url3 + transportname;
            //     var url8 = url4 + transdoc;
            //     var url9 = url5 + transid;
            //     var url10 = url6 + vehiclenum;
            //     var url11 = url7 + distance;

            //     var url = url1 + url6 + url7 + url8 + url9 + url10 + url11;

            //     var username = "ZEINV_USER";
            //     var password = "rmJqnvkrxzCb@EbkKMSzswFbEdMSmUnDUGcZXJ4E";
            //     $.ajax({
            //         url: url,
            //         type: "GET",
            //         beforeSend: function (xhr) {
            //             xhr.withCredentials = true;
            //             xhr.username = username;
            //             xhr.password = password;
            //         },
            //         success: function (result) {

            //             console.log(result)
            //             oBusyDialog.close();
            //             MessageBox.show(result, {
            //                 title: "Message",
            //                 emphasizedAction: MessageBox.Action.YES
            //             });

            //         }.bind(this)
            //     });


            // },

            // generateIRN: function () {
            //     var oBusyDialog = new sap.m.BusyDialog({
            //         title: "Generating",
            //         text: "Please wait"
            //     });
            //     oBusyDialog.open();
            //     var oTableModel = this.getView().getModel('oTableItemModel');
            //     var tableModel = oTableModel.getProperty('/aTableItem');

            //     var billingdoc = tableModel[0].BillingDocument;
            //     var eway = tableModel[0].Ebillno;
            //     var transportname = tableModel[0].TRANSPORTERNAME;
            //     var transdoc = tableModel[0].TransDocNo;
            //     var vehiclenum = tableModel[0].VEHICLENUMBER;
            //     var transid = tableModel[0].TRANSID;
            //     var distance = tableModel[0].CONDTY;

            //     // url = "https://my402116-api.s4hana.cloud.sap/sap/bc/http/sap/yeinv_http?Irn=X&eway=X&invoice=90000001&transporter=3556667&DISTANCE=600";
            //     var irn = "x";

            //     var url1 = "/sap/bc/http/sap/yeinv_http?Irn=X";
            //     var url2 = "&eway=";
            //     var url3 = "&invoice=";
            //     var url4 = "&transporter=";
            //     var url5 = "&transportdoc=";
            //     var url6 = "&transportid=";
            //     var url7 = "&vehiclenumber=";
            //     var url6 = "&DISTANCE=";

            //     var url7 = url2 + eway;
            //     var url8 = url3 + billingdoc;
            //     var url9 = url4 + transportname;
            //     var url10 = url5 + transdoc;

            //     var url10 = url6 + distance;

            //     var url = url1 + url2 + url7 + url8 + url9;

            //     var username = "ZEINV_USER";
            //     var password = "rmJqnvkrxzCb@EbkKMSzswFbEdMSmUnDUGcZXJ4E";
            //     $.ajax({
            //         url: url,
            //         type: "GET",
            //         beforeSend: function (xhr) {
            //             xhr.withCredentials = true;
            //             xhr.username = username;
            //             xhr.password = password;
            //         },
            //         success: function (result) {

            //             console.log(result)
            //             oBusyDialog.close();
            //             MessageBox.show(result, {
            //                 title: "Message",
            //                 emphasizedAction: MessageBox.Action.YES
            //             });

            //         }.bind(this)
            //     });

            // },

            // onGet: function () {
            //     var oTableModel = this.getView().getModel('oTableItemModel');
            //     var tableModel = oTableModel.getProperty('/aTableItem');
            //     console.log(tableModel);

            //     var billingdoc = tableModel[0].BillingDocument;
            //     var transportname = tableModel[0].TRANSPORTERNAME;
            //     var transdoc = tableModel[0].TransDocNo;
            //     var vehiclenum = tableModel[0].VEHICLENUMBER;
            //     var transid = tableModel[0].TRANSID;

            //     // var url = "https://my402116-api.s4hana.cloud.sap/sap/bc/http/sap/yeinv_http?Irn=X&eway=X&invoice=90000001&transporter=X&transporterid=X";
            //     var url1 = "https://my402116-api.s4hana.cloud.sap/sap/bc/http/sap/yeinv_http?";
            //     var url2 = "Irn=X";
            //     var url3 = "&eway=X";
            //     var url4 = "&invoice=";
            //     var url5 = "&transporter=";
            //     var url6 = "&transporterid=";

            //     var url7 = url4 + billingdoc;
            //     var url8 = url5 + transportname;
            //     var url9 = url6 + transid;

            //     var url = url1 + url2 + url3 + url7 + url8 + url9;
            // },

            cancelIrn: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Cancelling",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var oCommonModel = this.getOwnerComponent().getModel("oCommonModel")
                var invoiceType = oCommonModel.getProperty("/invoiceObject").InvoiceType;
                var oTableModel = this.getView().getModel('oTableItemModel');
                var tableModel = oTableModel.getProperty('/aTableItem');
                
                if(invoiceType === "Sales Invoice"){
                    var InvoiceType = "Sales Invoice"
                }else{
                    InvoiceType = "Finance Invoice"
                }

                var billingdoc = tableModel[0].BillingDocument;
                var eway = tableModel[0].Ebillno;
                var transportname = tableModel[0].TRANSPORTERNAME;
                var transdoc = tableModel[0].TransDocNo;
                var vehiclenum = tableModel[0].VEHICLENUMBER;
                var transid = tableModel[0].TRANSID;
                var distance = tableModel[0].Distance;

                // url = "https://my402116-api.s4hana.cloud.sap/sap/bc/http/sap/yeinv_http?Irn=X&eway=X&invoice=90000001&transporter=3556667&DISTANCE=600";
               // New url =  "https://my405100.s4hana.cloud.sap:443/sap/bc/http/sap/yeway?sap-client=080"
                var irn = "x";

                var url1 = "/sap/bc/http/sap/yeway";
                var url2 = "&Caneway=X";
                var url3 = "&invoice=";
                var url4 = "&InvoiceType="
                // var url4 = "&transporter=";
                // var url5 = "&transportdoc=";
                // var url6 = "&transportid=";
                // var url7 = "&vehiclenumber=";
                // var url6 = "&DISTANCE=";

                var url5 = url2 + eway;
                var url6 = url3 + billingdoc;
                var url7 = url4 + invoiceType
                // var url9 = url4 + transportname;
                // var url10 = url5 + transdoc;

                // var url10 = url6 + distance;

                var url = url1 + url2 + url6 + url7;

                var username = "ZEINV_USER";
                var password = "rmJqnvkrxzCb@EbkKMSzswFbEdMSmUnDUGcZXJ4E";
                $.ajax({
                    url: url,
                    type: "GET",
                    beforeSend: function (xhr) {
                        xhr.withCredentials = true;
                        xhr.username = username;
                        xhr.password = password;
                    },
                    success: function (result) {

                        console.log(result)
                        oBusyDialog.close();
                        MessageBox.show(result, {
                            title: "Message",
                            emphasizedAction: MessageBox.Action.YES
                        });

                    }.bind(this)
                });
            },

            cancelEway: function(){
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Generating",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var oTableModel = this.getView().getModel('oTableItemModel');
                var tableModel = oTableModel.getProperty('/aTableItem');

                var billingdoc = tableModel[0].BillingDocument;
                var eway = tableModel[0].Ebillno;
                var transportname = tableModel[0].TRANSPORTERNAME;
                var transdoc = tableModel[0].TransDocNo;
                var vehiclenum = tableModel[0].VEHICLENUMBER;
                var transid = tableModel[0].TRANSID;
                var distance = tableModel[0].Distance;

                // url = "https://my402116-api.s4hana.cloud.sap/sap/bc/http/sap/yeinv_http?Irn=X&eway=X&invoice=90000001&transporter=3556667&DISTANCE=600";
               // new ulr = "https://my405100.s4hana.cloud.sap:443/sap/bc/http/sap/yeway?sap-client=080"
                var irn = "x";

                var url1 = "/sap/bc/http/sap/yeway";
                var url2 = "&Caneway=X";
                var url3 = "&invoice=";
                // var url4 = "&transporter=";
                // var url5 = "&transportdoc=";
                // var url6 = "&transportid=";
                // var url7 = "&vehiclenumber=";
                // var url6 = "&DISTANCE=";

                var url7 = url2 + eway;
                var url8 = url3 + billingdoc;
                // var url9 = url4 + transportname;
                // var url10 = url5 + transdoc;

                // var url10 = url6 + distance;

                var url = url1 + url2 + url8;

                var username = "ZEINV_USER";
                var password = "rmJqnvkrxzCb@EbkKMSzswFbEdMSmUnDUGcZXJ4E";
                $.ajax({
                    url: url,
                    type: "GET",
                    beforeSend: function (xhr) {
                        xhr.withCredentials = true;
                        xhr.username = username;
                        xhr.password = password;
                    },
                    success: function (result) {

                        console.log(result)
                        oBusyDialog.close();
                        MessageBox.show(result, {
                            title: "Message",
                            emphasizedAction: MessageBox.Action.YES
                        });

                    }.bind(this)
                });
            }

        });
    }
);
