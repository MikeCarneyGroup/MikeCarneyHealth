export function Footer() {
  return (
    <footer className="border-t bg-white mt-auto">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Mike Carney Group</h3>
            <p className="text-sm text-gray-600">
              Supporting staff wellbeing and providing access to important resources.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/health-initiatives" className="text-gray-600 hover:text-primary-600">
                  Health Initiatives
                </a>
              </li>
              <li>
                <a href="/careers" className="text-gray-600 hover:text-primary-600">
                  Careers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-sm text-gray-600">
              For support or questions, please contact your HR department.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Mike Carney Group. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
