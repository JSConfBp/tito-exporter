import XLSX from 'xlsx'

export default (data) => {

	// make the worksheet
	const ws = XLSX.utils.json_to_sheet(data);

	// add to workbook
	const wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, "People");

	// write workbook
	const buf = XLSX.write(wb, {
		bookType: 'xlsx',
		type: 'array',
		bookSST: true,
	});

	return buf
}
