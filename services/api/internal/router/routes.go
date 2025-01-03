package router

import (
    "net/http"

    "github.com/labstack/echo/v4"
)

// Item represents a simple item
type Item struct {
    ID    string `json:"id"`
    Name  string `json:"name"`
    Price int    `json:"price"`
}

// 仮のデータ
var items = map[string]Item{}

// RegisterRoutes sets up all the routes
func ItemRoutes(api *echo.Group) {
    api.GET("/items", getItems)
    api.GET("/items/:id", getItem)
    api.POST("/items", createItem)
    api.PUT("/items/:id", updateItem)
    api.DELETE("/items/:id", deleteItem)
}

// @Summary Get all items
// @Tags items
// @Success 200 {array} Item
// @Router /items [get]
func getItems(c echo.Context) error {
    var list []Item
    for _, item := range items {
        list = append(list, item)
    }
    return c.JSON(http.StatusOK, list)
}

// @Summary Get an item by ID
// @Tags items
// @Param id path string true "Item ID"
// @Success 200 {object} Item
// @Failure 404 {string} string "Not Found"
// @Router /items/{id} [get]
func getItem(c echo.Context) error {
    id := c.Param("id")
    item, exists := items[id]
    if !exists {
        return c.String(http.StatusNotFound, "Not Found")
    }
    return c.JSON(http.StatusOK, item)
}

// @Summary Create a new item
// @Tags items
// @Param item body Item true "Item to create"
// @Success 201 {object} Item
// @Router /items [post]
func createItem(c echo.Context) error {
    var item Item
    if err := c.Bind(&item); err != nil {
        return err
    }
    items[item.ID] = item
    return c.JSON(http.StatusCreated, item)
}

// @Summary Update an existing item
// @Tags items
// @Param id path string true "Item ID"
// @Param item body Item true "Updated item"
// @Success 200 {object} Item
// @Failure 404 {string} string "Not Found"
// @Router /items/{id} [put]
func updateItem(c echo.Context) error {
    id := c.Param("id")
    if _, exists := items[id]; !exists {
        return c.String(http.StatusNotFound, "Not Found")
    }
    var item Item
    if err := c.Bind(&item); err != nil {
        return err
    }
    items[id] = item
    return c.JSON(http.StatusOK, item)
}

// @Summary Delete an item
// @Tags items
// @Param id path string true "Item ID"
// @Success 204 {string} string "No Content"
// @Failure 404 {string} string "Not Found"
// @Router /items/{id} [delete]
func deleteItem(c echo.Context) error {
    id := c.Param("id")
    if _, exists := items[id]; !exists {
        return c.String(http.StatusNotFound, "Not Found")
    }
    delete(items, id)
    return c.NoContent(http.StatusNoContent)
}
