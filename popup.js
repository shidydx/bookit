document.addEventListener("DOMContentLoaded", () => {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        console.log("No tabs to bookmark.");
        return;
      }
  
      const today = new Date().toISOString().split("T")[0];
  
      chrome.bookmarks.search({ title: "Bookit" }, (results) => {
        let bookitFolder = results.find((folder) => folder.title === "Bookit");
  
        if (!bookitFolder) {
          chrome.bookmarks.create({ title: "Bookit" }, (newFolder) => {
            bookitFolder = newFolder;
            createUniqueDateFolderAndBookmarks(bookitFolder.id, today, tabs);
          });
        } else {
          createUniqueDateFolderAndBookmarks(bookitFolder.id, today, tabs);
        }
      });
    });
  
    function createUniqueDateFolderAndBookmarks(parentId, date, tabs) {
      chrome.bookmarks.getChildren(parentId, (children) => {
        const dateFolders = children.filter((child) => child.title.startsWith(date));
        let folderTitle = date;
  
        if (dateFolders.length > 0) {
          folderTitle = `${date} (${dateFolders.length + 1})`;
        }
  
        chrome.bookmarks.create(
          {
            parentId: parentId,
            title: folderTitle,
          },
          (dateFolder) => {
            tabs.forEach((tab) => {
              chrome.bookmarks.create({
                parentId: dateFolder.id,
                title: tab.title,
                url: tab.url,
              });
            });
            console.log(`Bookmarked ${tabs.length} tabs into folder 'Bookit/${folderTitle}'.`);
          }
        );
      });
    }
  });