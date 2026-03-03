const quickStartItem = { text: "Back to Home", link: "/quick-start" };
const mar = [
	{
		text: "Inquiry",
		collapsed: true,
		items: [
			{ text: "Add new inquiry", link: "/mar/inquiry-new" },
			{
				text: "Add stock part inquiry",
				link: "/mar/inquiry-stock",
			},
			{
				text: "On process inquiry",
				link: "/mar/inquiry-onprocess",
			},
			{
				text: "Pending pre-bm inquiry",
				link: "/mar/inquiry-prebm",
			},
			{
				text: "Inquiry report",
				link: "/mar/inquiry-report",
			},
		],
	},
	{
		text: "Quotation",
		collapsed: true,
		items: [
			{ text: "Issue Quotation", link: "/mar/quotation-issue" },
			{ text: "Pending Weight", link: "/mar/quotation-weight" },
			{ text: "Quotation Released", link: "/mar/quotation-release" },
			{ text: "Add Out-Out quotation", link: "/mar/quotation-out" },
		],
	},
	{ text: "Orders", link: "/mar/orders" },
	{
		text: "Price List",
		collapsed: true,
		items: [
			{ text: "Price List", link: "/mar/price-history" },
			{ text: "Items/Drawing", link: "/mar/price-item" },
		],
	},
	{
		text: "Master",
		collapsed: true,
		items: [
			{ text: "Price Ratio", link: "/mar/master-ratio" },
			{ text: "Inquiry Controller", link: "/mar/master-control" },
			{ text: "Currency", link: "/mar/master-cur" },
		],
	},
];
const sale = [];
const de = [];
const fin = [
	{
		text: "Price Confirmation",
		link: "/fin/confirm",
	},
	{
		text: "Check inquiry",
		link: "/fin/check",
	},
	{
		text: "Price Approval",
		link: "/fin/approve",
	},
	{
		text: "Running Inquiry",
		link: "/fin/inquiry",
	},
	{
		text: "Price List",
		link: "/fin/price-list",
	},
	{
		text: "Item Master",
		link: "/fin/item",
	},
];
const pkc = [];

export const marItem = [...mar, quickStartItem];
export const saleItem = [...sale, quickStartItem];
export const deItem = [...de, quickStartItem];
export const finItem = [...fin, quickStartItem];
export const pkcItem = [...pkc, quickStartItem];
