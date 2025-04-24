# New Table requererments

this is needed to understand the role of table borders and border radius

- Table with Headers
  - border and radius should cover full table
- Table without Header
  - border and radius should cover full table
- Table with Action Header
  - the border need to be extended over to the action header
  - the border radius should not be at the header
- Table with Filter on top


## Conclusion
- we control the border itself on the wrapper including the radius
- we need to control the radius in addition on the header and on the last row

- we need an indication that the top should have no radius


Attribute: attached= top | bottom | both
.table-attached-top
.table-attached-bottom 
.table-attached-both