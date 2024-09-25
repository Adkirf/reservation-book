1. Create Overview.md
@Codebase 
I want to develop an nextjs app for small-to-medium gastronomy businesses to efficiently manage reservations. It offers an intuitive interface to handle key reservation tasks: adding, editing, and deleting reservations. The app supports two types of users: admins, who can manage users and reservations, and employees, who can manage only the reservation system. The desired flows are: 
1. User Flow: Anyone can open the webapp, enter email and password, authenticate via Firebase Authentication and if successful receive a role.  
2. Employee Flow:
- Employees have access to a dashboard view Monthly, weekly and daily view to reservation book. Depending on current view, the “add reservation form” is prefilled with data.  
- Create a new reservation: tap floating “+” button, reservation form opens, input required information, tap save to store to firebase. 
- Edit/delete a reservation: tap on a reservation, reservation modal opens with editable details, tap save to save, or delete and confirm to delete. 
3. Admin Flow: 
- Access to the User Management with a list of current users. 
- Click on a user to delete. 
- Add a button to create a new user. 

Create an overview SOP file in the documentation folder and name it overview.md. Break down all of the steps that we need to create the MVP of this product. Make sure to mark everything with markdown checkboxes as we progress. We dont need to talk about deployment or testing, focus on the steps to get a working version of the app. 

2. Create overview.md.prerequisite
@Codebase @overview.md 
Please review this overview SOP and the current codebase and give me a recommended folder structure for this next.js project.  
(Wait for result).

@Codebase @overview.md 
Please create this folder structure as outlined in the overview Prerequistes and fill it with dummy code for now.

3. Create setup.md
@Codebase @overview.md 
Please review the overview SOP and create a setup.md SOP file which will break down the steps that we need to complete the Setup and Configuration. Do not include code examples, only a bullet point checklist of all the steps we need to take at this state. 

4. Update Folder structure setup.mp
@Codebase @overview.md 
Please review the overview and @setup.md SOP file and add all files and folders required for this step - if not existing already. Update the folder structure accoridngly. 

5. Create userflow.md
@Codebase @overview.md 
Please review the overview SOP and create a userflow.md SOP file which will break down the steps that we need to complete for the **User Flow** in more detail. Do not include code examples, only a bullet point checklist of all the steps required for this flow. 

6. Update Folder structure userflow.mp
@Codebase @overview.md 
Please review the @userflow.md SOP file and compare it to the folder structure and current progress in the overview.md file. Add any missing file or folder required for this step - if not existing already. Do include code for now - focus only on updating the required folder structure for the **User Flow**

7. Create employeeflow.md
@Codebase @overview.md 
Please review the overview SOP and create a employeeflow.md SOP file which will break down the steps that we need to complete for the **Employee Flow** in more detail. Do not include code examples, only a bullet point checklist of all the steps required for this flow. 

8 Update folder structure employeeflow.mp
@Codebase @overview.md 
Please review the @employeeflow.md SOP file and compare it to the folder structure and current progress in the overview.md file. Add any missing file or folder required for this step - if not existing already. Do include code for now - focus only on updating the required folder structure for the **Employee Flow**

7. Create adminflow.md
@Codebase @overview.md 
Please review the overview SOP and create a adminflow.md SOP file which will break down the steps that we need to complete for the **Admin Flow** in more detail. Do not include code examples, only a bullet point checklist of all the steps required for this flow. 

8 Update folder structure admingflow.mp
@Codebase @overview.md 
Please review the @admingflow.md SOP file and compare it to the folder structure and current progress in the overview.md file. Add any missing file or folder required for this step - if not existing already. Do include code for now - focus only on updating the required folder structure for the **Adming Flow**

9. Implement setup.md
@Codebase @overview.md 
Review the folde structure in the overview.md file to follow exactly the instructions in @setup.md. Implement the unfinished steps by updating the necessary files and function. Use existing code and files whereever possible, and give suggestions when a new file would improve the overall structure. 

10. Implement userflow.md
@Codebase @overview.md 
Review the folde structure in the overview.md file to follow exactly the instructions in @userflow.md. Implement the unfinished steps by updating the necessary files and function. Use existing code and files whereever possible, do NOT create new files, only suggest when a new file would improve the overall structure. 

11. Implement employeeflow.md
@Codebase @overview.md 
Review the folde structure in the overview.md file to follow exactly the instructions in @employeeflow.md. Implement the unfinished steps by updating the necessary files and function. Use existing code and files whereever possible, do NOT create new files, only suggest when a new file would improve the overall structure.

12. Implement adminflow.md
@Codebase @overview.md 

6. Implement frontend.md
@Codebase @overview.md 
Please review the overview and @frontend.md SOP files and work through the steps in Main Layout Component and Home Page one by one to create and update all the necessary files and functions.
 - @Codebase @overview.md 
Follow exactly the instructions in @ImplementWalletConnect.md to work through the steps in Implemement WalleConnect in the @frontend.md SOP, to create and update all the necessary files functions. 
- @Codebase @overview.md
Follow exactly the instructions in @ImplementSIWE.md  to work through the steps in SIWE and One-Click Auth in the @frontend.md SOP, to create and update all the necessary files functions. 
- @Codebase @overview.md 
Please review the overview.md and @frontend.md SOP files and work through the steps in Final Review one by one and update all the necessary files and functions.
- @Codebase @overview.md 
Please review the @AboutSIWE.md and @frontend.md SOP and answer the Questions one by one.  
- @Codebase @overview.md 
Follow exactly the instructions in @WagmiSendTransaction.md to work through the steps in Transaction Form Component in the @frontend.md SOP, to create and update all the necessary files functions. 

7. Create backend.md
@Codebase @overview.md 
Please review the overview SOP and create a backend.md SOP file which will break down the steps that we need to complete for the Backend Development in more detail. Consider that we are using a mock blockchain with the following user flow: Authenticated users can mint an NFT for 0.05 ETH, transaction request is submitted to wallet, user approves or declines, all information of approved or declined transaction are stored to local mock blockchain. All NFT related transactions need to be send to NFT smart contract adress, and update the information accoridngly. 


8. Implmenent backend.md
@codebase @overview.md 
Please review the overview and @backend.md SOP files and work through the steps one by one to create and update all the necessary files and functions. 
    (Before continuing, please check again @Codebase , the @backend.md and our current chat to mark our current progress with the corresponding checkmarks. )
    (@Codebase @overview.md 
    Please review the overview and @backend.md SOP files and work through the unfinished steps on by one to create and update all the necessary files and functions. )



 

 




## Transaction History Component
- [ ] Create TransactionHistory component in src/components/transactions/TransactionHistory.tsx
- [ ] Implement a list or table to display transaction history
- [ ] Add pagination or infinite scroll for large transaction lists
- [ ] Include filters for transaction type, date range, etc.
- [ ] Display transaction details (amount, sender, recipient, date, status)

## NFT Gallery Component
- [ ] Create NFTGallery component in src/components/nft/NFTGallery.tsx
- [ ] Implement a grid or list view to display owned NFTs
- [ ] Add individual NFT cards with image, name, and basic details
- [ ] Implement pagination or infinite scroll for large NFT collections
- [ ] Add a search or filter functionality for NFTs

## NFT Transfer Component
- [ ] Create NFTTransfer component in src/components/nft/NFTTransfer.tsx
- [ ] Design form for selecting an NFT to transfer
- [ ] Implement recipient address input and validation
- [ ] Add submit button to initiate NFT transfer
- [ ] Display loading state during transfer processing

## UI Enhancements
- [ ] Apply consistent styling using Tailwind CSS
- [ ] Integrate shadcn UI components where appropriate
- [ ] Ensure responsive design for all components
- [ ] Implement dark mode toggle (if desired)
- [ ] Add loading skeletons or placeholders for async content

## Error Handling and User Feedback
- [ ] Implement toast notifications for success/error messages
- [ ] Add inline form validation feedback
- [ ] Create error boundary components for graceful error handling


