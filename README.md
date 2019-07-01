# Pivot Table App
  
### Project Pivot Table App Setup (script)
  * run the script 'launch_pivot_table.app.sh' from the project root folder
    * bash launch_pivot_table.app.sh

### Project Pivot Table App Setup (Manual)
  * run 'npm run build:dev' - this will generate the resources in the dist folder
  * run 'npm start:dev:server' - this will launch a server listening on port 8080 on your local host


#### Details
  * On the initial lauch the user will be presented with two dropdowns that will allow them to slice the data based on src and destination ip.
  * Hovering on individual cells under the src and dest ip will present the user with a clickable link 'solo' where they can apply additional filter to the src and dest columns


Note:
  The library for the pivot table does not work with newer versions of webpack . Thats the reason why I had to work with a cdn resource.